const { createApp } = Vue;

const API_URL = 'http://localhost:3000';
const WS_URL = 'ws://localhost:3000';

createApp({
    data() {
        return {
            ws: null,
            wsConnected: false,
            events: [],
            stats: {},
            filters: {
                agent: '',
                eventType: '',
                session: '',
                task: ''
            },
            agents: [],
            eventTypes: [],
            sessions: [],
            interventionMode: false,
            pendingApprovals: []
        };
    },
    computed: {
        filteredEvents() {
            let filtered = [...this.events];
            
            if (this.filters.agent) {
                filtered = filtered.filter(e => e.agent_id === this.filters.agent);
            }
            if (this.filters.eventType) {
                filtered = filtered.filter(e => e.event_type === this.filters.eventType);
            }
            if (this.filters.session) {
                filtered = filtered.filter(e => e.session_id === this.filters.session);
            }
            if (this.filters.task) {
                filtered = filtered.filter(e => e.task_id === this.filters.task);
            }
            
            return filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        }
    },
    mounted() {
        this.connectWebSocket();
        this.loadInitialData();
        this.loadStats();
        
        // Refresh stats every 5 seconds
        setInterval(() => {
            this.loadStats();
        }, 5000);
    },
    methods: {
        connectWebSocket() {
            try {
                this.ws = new WebSocket(WS_URL);
                
                this.ws.onopen = () => {
                    this.wsConnected = true;
                    console.log('WebSocket connected');
                };
                
                this.ws.onmessage = (event) => {
                    const message = JSON.parse(event.data);
                    
                    if (message.type === 'event') {
                        this.events.unshift(message.data);
                        
                        // Keep only last 1000 events
                        if (this.events.length > 1000) {
                            this.events = this.events.slice(0, 1000);
                        }
                        
                        // Update unique lists
                        this.updateUniqueLists(message.data);
                    }
                };
                
                this.ws.onerror = (error) => {
                    console.error('WebSocket error:', error);
                    this.wsConnected = false;
                };
                
                this.ws.onclose = () => {
                    this.wsConnected = false;
                    console.log('WebSocket disconnected');
                    
                    // Reconnect after 3 seconds
                    setTimeout(() => {
                        this.connectWebSocket();
                    }, 3000);
                };
            } catch (error) {
                console.error('Failed to connect WebSocket:', error);
                this.wsConnected = false;
            }
        },
        
        async loadInitialData() {
            try {
                const response = await fetch(`${API_URL}/events?limit=100`);
                const data = await response.json();
                this.events = data;
                
                // Extract unique values
                this.updateUniqueLists();
            } catch (error) {
                console.error('Failed to load initial data:', error);
            }
        },
        
        async loadStats() {
            try {
                const response = await fetch(`${API_URL}/stats`);
                const data = await response.json();
                this.stats = data;
            } catch (error) {
                console.error('Failed to load stats:', error);
            }
        },
        
        updateUniqueLists(event = null) {
            if (event) {
                // Add from single event
                if (event.agent_id && !this.agents.includes(event.agent_id)) {
                    this.agents.push(event.agent_id);
                }
                if (event.event_type && !this.eventTypes.includes(event.event_type)) {
                    this.eventTypes.push(event.event_type);
                }
                if (event.session_id && !this.sessions.includes(event.session_id)) {
                    this.sessions.push(event.session_id);
                }
            } else {
                // Extract from all events
                this.agents = [...new Set(this.events.map(e => e.agent_id).filter(Boolean))];
                this.eventTypes = [...new Set(this.events.map(e => e.event_type).filter(Boolean))];
                this.sessions = [...new Set(this.events.map(e => e.session_id).filter(Boolean))];
            }
        },
        
        handleFilterChange(filters) {
            this.filters = { ...this.filters, ...filters };
        },
        
        selectSession(sessionId) {
            this.filters.session = sessionId;
        },
        
        formatNumber(num) {
            return new Intl.NumberFormat().format(num);
        },
        
        formatCost(cost) {
            return parseFloat(cost).toFixed(4);
        },
        
        formatTimestamp(timestamp) {
            return new Date(timestamp).toLocaleString();
        },
        
        handleApproval(approvalId) {
            // Send approval to server
            console.log('Approving:', approvalId);
            this.pendingApprovals = this.pendingApprovals.filter(a => a.id !== approvalId);
        },
        
        handleRejection(approvalId) {
            // Send rejection to server
            console.log('Rejecting:', approvalId);
            this.pendingApprovals = this.pendingApprovals.filter(a => a.id !== approvalId);
        }
    },
    components: {
        ActivityFeed: {
            props: ['events', 'selectedSession'],
            template: `
                <div class="activity-feed">
                    <h2>Activity Feed</h2>
                    <div v-if="events.length === 0" class="empty-state">
                        No events to display
                    </div>
                    <div v-for="event in events" :key="event.id" class="event-item">
                        <div class="event-header">
                            <span :class="['event-type', event.event_type]">{{ event.event_type }}</span>
                            <span class="event-timestamp">{{ formatTimestamp(event.timestamp) }}</span>
                        </div>
                        <div class="event-summary">{{ event.summary }}</div>
                        <div class="event-meta">
                            <span v-if="event.session_id">
                                <strong>Session:</strong> {{ event.session_id }}
                            </span>
                            <span v-if="event.agent_id">
                                <strong>Agent:</strong> {{ event.agent_id }}
                            </span>
                            <span v-if="event.task_id">
                                <strong>Task:</strong> {{ event.task_id }}
                            </span>
                            <span v-if="event.tokens_input + event.tokens_output > 0">
                                <strong>Tokens:</strong> {{ formatNumber(event.tokens_input + event.tokens_output) }}
                            </span>
                            <span v-if="event.cost > 0">
                                <strong>Cost:</strong> ${{ formatCost(event.cost) }}
                            </span>
                        </div>
                    </div>
                </div>
            `,
            methods: {
                formatTimestamp(timestamp) {
                    return new Date(timestamp).toLocaleString();
                },
                formatNumber(num) {
                    return new Intl.NumberFormat().format(num);
                },
                formatCost(cost) {
                    return parseFloat(cost).toFixed(4);
                }
            }
        },
        
        FilterPanel: {
            props: ['agents', 'eventTypes', 'sessions'],
            emits: ['filter-change'],
            data() {
                return {
                    localFilters: {
                        agent: '',
                        eventType: '',
                        session: '',
                        task: ''
                    }
                };
            },
            watch: {
                localFilters: {
                    deep: true,
                    handler(newVal) {
                        this.$emit('filter-change', newVal);
                    }
                }
            },
            template: `
                <div class="filter-panel">
                    <h3>Filters</h3>
                    <div class="filter-group">
                        <label>Agent</label>
                        <select v-model="localFilters.agent">
                            <option value="">All Agents</option>
                            <option v-for="agent in agents" :key="agent" :value="agent">{{ agent }}</option>
                        </select>
                    </div>
                    <div class="filter-group">
                        <label>Event Type</label>
                        <select v-model="localFilters.eventType">
                            <option value="">All Types</option>
                            <option v-for="type in eventTypes" :key="type" :value="type">{{ type }}</option>
                        </select>
                    </div>
                    <div class="filter-group">
                        <label>Session</label>
                        <select v-model="localFilters.session">
                            <option value="">All Sessions</option>
                            <option v-for="session in sessions" :key="session" :value="session">{{ session }}</option>
                        </select>
                    </div>
                    <div class="filter-group">
                        <label>Task</label>
                        <input type="text" v-model="localFilters.task" placeholder="Task ID">
                    </div>
                </div>
            `
        },
        
        InterventionPanel: {
            props: ['pendingApprovals'],
            emits: ['approve', 'reject'],
            template: `
                <div v-if="pendingApprovals.length > 0" class="intervention-panel">
                    <h3>Pending Approvals</h3>
                    <div v-for="approval in pendingApprovals" :key="approval.id" class="approval-item">
                        <div>
                            <strong>{{ approval.agent }}</strong> requests approval for: {{ approval.action }}
                        </div>
                        <div class="approval-actions">
                            <button class="btn btn-approve" @click="$emit('approve', approval.id)">Approve</button>
                            <button class="btn btn-reject" @click="$emit('reject', approval.id)">Reject</button>
                        </div>
                    </div>
                </div>
            `
        }
    }
}).mount('#app');

