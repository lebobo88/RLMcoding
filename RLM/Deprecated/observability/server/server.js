#!/usr/bin/env node
/**
 * RLM Observability Backend Server
 * HTTP API for event ingestion and WebSocket for real-time broadcasting
 */

import express from 'express';
import { WebSocketServer } from 'ws';
import http from 'http';
import cors from 'cors';
import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration
const PORT = process.env.RLM_OBSERVABILITY_SERVER_PORT || 3000;
const HOST = process.env.RLM_OBSERVABILITY_SERVER_HOST || 'localhost';

// Database setup
const RLM_ROOT = join(__dirname, '../..');
const EVENTS_DB = join(RLM_ROOT, 'progress', 'events.db');

// Ensure database exists
const db = new Database(EVENTS_DB);
db.pragma('journal_mode = WAL');

// Initialize tables if needed
db.exec(`
  CREATE TABLE IF NOT EXISTS events (
    id TEXT PRIMARY KEY,
    timestamp TEXT NOT NULL,
    session_id TEXT,
    agent_id TEXT,
    task_id TEXT,
    event_type TEXT NOT NULL,
    summary TEXT,
    details_json TEXT,
    tokens_input INTEGER DEFAULT 0,
    tokens_output INTEGER DEFAULT 0,
    cost REAL DEFAULT 0.0,
    duration_ms INTEGER DEFAULT 0
  );

  CREATE INDEX IF NOT EXISTS idx_timestamp ON events(timestamp);
  CREATE INDEX IF NOT EXISTS idx_session_id ON events(session_id);
  CREATE INDEX IF NOT EXISTS idx_agent_id ON events(agent_id);
  CREATE INDEX IF NOT EXISTS idx_task_id ON events(task_id);
  CREATE INDEX IF NOT EXISTS idx_event_type ON events(event_type);
`);

// Express app
const app = express();
app.use(cors());
app.use(express.json());

// HTTP server
const server = http.createServer(app);

// WebSocket server
const wss = new WebSocketServer({ server });

// Broadcast to all connected clients
function broadcast(data) {
  const message = JSON.stringify(data);
  wss.clients.forEach((client) => {
    if (client.readyState === 1) { // WebSocket.OPEN
      client.send(message);
    }
  });
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Event ingestion endpoint
app.post('/events', (req, res) => {
  try {
    const event = req.body;
    
    // Validate required fields
    if (!event.id || !event.timestamp || !event.event_type) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Insert into database
    const stmt = db.prepare(`
      INSERT OR REPLACE INTO events (
        id, timestamp, session_id, agent_id, task_id, event_type,
        summary, details_json, tokens_input, tokens_output, cost, duration_ms
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(
      event.id,
      event.timestamp,
      event.session_id || null,
      event.agent_id || null,
      event.task_id || null,
      event.event_type,
      event.summary || null,
      typeof event.details === 'object' ? JSON.stringify(event.details) : (event.details_json || '{}'),
      event.tokens?.input || event.tokens_input || 0,
      event.tokens?.output || event.tokens_output || 0,
      event.cost || 0.0,
      event.duration_ms || 0
    );
    
    // Broadcast to WebSocket clients
    broadcast({
      type: 'event',
      data: event
    });
    
    res.json({ success: true, id: event.id });
  } catch (error) {
    console.error('Error ingesting event:', error);
    res.status(500).json({ error: error.message });
  }
});

// Query events endpoint
app.get('/events', (req, res) => {
  try {
    const { session_id, agent_id, task_id, event_type, limit = 100 } = req.query;
    
    let query = 'SELECT * FROM events WHERE 1=1';
    const params = [];
    
    if (session_id) {
      query += ' AND session_id = ?';
      params.push(session_id);
    }
    if (agent_id) {
      query += ' AND agent_id = ?';
      params.push(agent_id);
    }
    if (task_id) {
      query += ' AND task_id = ?';
      params.push(task_id);
    }
    if (event_type) {
      query += ' AND event_type = ?';
      params.push(event_type);
    }
    
    query += ' ORDER BY timestamp DESC LIMIT ?';
    params.push(parseInt(limit));
    
    const stmt = db.prepare(query);
    const events = stmt.all(...params);
    
    res.json(events);
  } catch (error) {
    console.error('Error querying events:', error);
    res.status(500).json({ error: error.message });
  }
});

// Statistics endpoint
app.get('/stats', (req, res) => {
  try {
    const stats = db.prepare(`
      SELECT 
        COUNT(*) as total_events,
        COUNT(DISTINCT session_id) as unique_sessions,
        COUNT(DISTINCT agent_id) as unique_agents,
        COUNT(DISTINCT task_id) as unique_tasks,
        SUM(tokens_input + tokens_output) as total_tokens,
        SUM(cost) as total_cost,
        AVG(duration_ms) as avg_duration_ms
      FROM events
    `).get();
    
    res.json(stats);
  } catch (error) {
    console.error('Error getting stats:', error);
    res.status(500).json({ error: error.message });
  }
});

// Agent statistics endpoint
app.get('/stats/agents', (req, res) => {
  try {
    const stats = db.prepare(`
      SELECT 
        agent_id,
        COUNT(*) as event_count,
        SUM(tokens_input + tokens_output) as total_tokens,
        SUM(cost) as total_cost,
        AVG(duration_ms) as avg_duration_ms
      FROM events
      WHERE agent_id IS NOT NULL
      GROUP BY agent_id
      ORDER BY total_tokens DESC
    `).all();
    
    res.json(stats);
  } catch (error) {
    console.error('Error getting agent stats:', error);
    res.status(500).json({ error: error.message });
  }
});

// WebSocket connection handling
wss.on('connection', (ws) => {
  console.log('WebSocket client connected');
  
  // Send welcome message
  ws.send(JSON.stringify({
    type: 'connected',
    message: 'Connected to RLM Observability Server'
  }));
  
  ws.on('close', () => {
    console.log('WebSocket client disconnected');
  });
  
  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

// Start server
server.listen(PORT, HOST, () => {
  console.log(`RLM Observability Server running on http://${HOST}:${PORT}`);
  console.log(`WebSocket available at ws://${HOST}:${PORT}`);
  console.log(`Database: ${EVENTS_DB}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down server...');
  wss.close();
  server.close(() => {
    db.close();
    process.exit(0);
  });
});

