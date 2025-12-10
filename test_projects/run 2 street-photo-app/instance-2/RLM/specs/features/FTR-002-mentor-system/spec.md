# FTR-002: Virtual Mentor System

**Priority**: P0 (MVP)
**Status**: Approved
**Created**: 2025-12-02

---

## Overview

The Virtual Mentor System brings legendary street photographers to life as AI-powered conversational coaches. Each mentor has a distinct personality, teaching style, and area of expertise based on their historical work and documented philosophies.

## User Stories

**As a street photographer**, I want to:
- Chat with virtual versions of legendary photographers so I can get personalized advice
- Ask specific questions about technique or approach so I can improve my skills
- Get feedback on my photo descriptions so I can learn what works
- Switch between different mentors to get diverse perspectives

## Acceptance Criteria

### Must Have (P0)
- [ ] 5 mentors available: Cartier-Bresson, Maier, Winogrand, Arbus, Erwitt
- [ ] Chat interface with streaming responses (real-time)
- [ ] Each mentor has distinct voice and personality
- [ ] Chat history persists in IndexedDB
- [ ] Mentors can reference feed content ("As I mentioned in...")
- [ ] 20 messages/hour rate limit per user
- [ ] Mobile-optimized chat UI (keyboard doesn't overlap input)
- [ ] Works offline with cached responses for common questions

### Should Have (P1)
- [ ] Mentor suggests related feed items after answering
- [ ] "Ask another mentor" button to get second opinion
- [ ] Chat export as text/PDF
- [ ] Voice input (speech-to-text)

---

## Mentor Profiles

### Henri Cartier-Bresson
**Specialty**: Composition, decisive moment, patience
**Voice**: Strict, precise, geometry-obsessed
**Signature Phrases**:
- "Wait for the geometry to align."
- "There is nothing in this world that does not have a decisive moment."
- "You must respect the integrity of the frame. No cropping."

### Vivian Maier
**Specialty**: Candid photography, invisibility, observation
**Voice**: Quiet, empathetic, detail-oriented
**Signature Phrases**:
- "Become part of the scene. They shouldn't notice you're there."
- "The best portraits happen when they forget the camera exists."
- "Look for the overlooked."

### Garry Winogrand
**Specialty**: Energy, chaos, volume shooting
**Voice**: Frenetic, bold, experimental
**Signature Phrases**:
- "Shoot more. Think less. Trust the chaos."
- "You don't capture a moment. You stumble into it."
- "Take a thousand photos. One will surprise you."

### Diane Arbus
**Specialty**: Emotion, unconventional subjects, depth
**Voice**: Provocative, introspective, empathetic
**Signature Phrases**:
- "Photograph what makes you uncomfortable."
- "Everyone has a secret. Find it."
- "The camera is a kind of license."

### Elliott Erwitt
**Specialty**: Wit, humor, timing, irony
**Voice**: Playful, observant, witty
**Signature Phrases**:
- "Photography is about finding irony in the mundane."
- "If you can make someone smile with a photo, you've won."
- "Life is funny. Photos should be too."

---

## Technical Implementation

### System Prompts

```typescript
const MENTOR_SYSTEM_PROMPTS = {
  'cartier-bresson': `
    You are Henri Cartier-Bresson, founder of Magnum Photos and master of the decisive moment.

    PERSONALITY:
    - Strict but patient teacher
    - Obsessed with geometry and composition
    - Believes in pre-visualization and getting it right in-camera
    - Disapproves of cropping (with rare exceptions)
    - Values patience and waiting for the perfect moment

    TEACHING STYLE:
    - Use short, direct sentences
    - Reference geometric shapes and lines
    - Emphasize the importance of waiting
    - Quote your own famous sayings when relevant
    - Draw from your experiences in France, Spain, India

    COMMON TOPICS:
    - The decisive moment
    - Rule of thirds and golden ratio
    - Pre-focusing techniques
    - Zone focusing
    - Leica 50mm lens philosophy

    RESPONSE FORMAT:
    - Keep responses under 150 words
    - End with a actionable suggestion
    - Occasionally reference your photos as examples
  `,
  // ... (other mentors)
};
```

### API Endpoint

**POST /api/mentor**

Request:
```typescript
{
  mentorId: 'cartier-bresson';
  message: string;
  context?: {
    recentItems?: string[]; // Recently viewed feed IDs
    currentChallenge?: string;
    location?: string;
  };
}
```

Response (streaming):
```typescript
{
  response: string; // Streamed token by token
  relatedItems?: string[]; // Feed items to explore
  suggestedActions?: {
    type: 'challenge' | 'technique';
    id: string;
    label: string;
  }[];
}
```

### Component Structure

```
components/mentors/
├── MentorSelector.tsx      # Grid of mentor avatars
├── MentorCard.tsx          # Mentor profile card
├── ChatInterface.tsx       # Main chat UI
├── ChatMessage.tsx         # Single message bubble
├── ChatInput.tsx           # Input with send button
├── MentorTyping.tsx        # Typing indicator
└── MentorSuggestions.tsx   # Related items after response
```

### Key Hook

```typescript
export function useMentorChat(mentorId: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (message: string) => {
    setIsLoading(true);

    // Add user message
    setMessages(prev => [...prev, {
      role: 'user',
      content: message,
      timestamp: Date.now(),
    }]);

    // Stream response
    const response = await fetch('/api/mentor', {
      method: 'POST',
      body: JSON.stringify({ mentorId, message }),
    });

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    let assistantMessage = '';

    while (true) {
      const { done, value } = await reader!.read();
      if (done) break;

      assistantMessage += decoder.decode(value);
      setMessages(prev => [
        ...prev.slice(0, -1),
        {
          role: 'assistant',
          content: assistantMessage,
          timestamp: Date.now(),
        },
      ]);
    }

    setIsLoading(false);
  };

  return { messages, sendMessage, isLoading };
}
```

---

## Success Metrics

| Metric | Target |
|--------|--------|
| **Avg. Messages/Session** | 5+ |
| **Response Time** | < 3s (streaming starts < 1s) |
| **Mentor Diversity** | 40%+ users try 2+ mentors |
| **Satisfaction** | 4.5+ star rating |

---

**Feature Version**: 1.0
**Last Updated**: 2025-12-02
