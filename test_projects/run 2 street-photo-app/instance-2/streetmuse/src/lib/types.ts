// Photographer Types
export interface Photographer {
  id: string
  name: string
  yearsActive: string
  nationality: string
  specialty: string[]
  bio: string
  color: string // Mentor color from design system
  quote: string
}

// Feed Item Types
export type FeedItemType = 'quote' | 'technique' | 'challenge' | 'story' | 'breakdown'
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced'
export type TimeOfDay = 'golden-hour' | 'blue-hour' | 'midday' | 'night'
export type Weather = 'sunny' | 'overcast' | 'rainy' | 'foggy'
export type LocationType = 'urban' | 'suburban' | 'rural' | 'indoor'

export interface FeedItemMetadata {
  tags: string[]
  difficulty: DifficultyLevel
  readTime: number // seconds
  createdAt: string
}

export interface FeedItemContext {
  timeOfDay?: TimeOfDay[]
  weather?: Weather[]
  location?: LocationType[]
}

export interface FeedItemImage {
  url: string
  alt: string
  credit?: string
}

export interface FeedItemContent {
  title?: string
  body: string
  image?: FeedItemImage
  steps?: string[] // For technique cards
  annotations?: string[] // For breakdown cards
}

export interface FeedItem {
  id: string
  type: FeedItemType
  photographer: Photographer
  content: FeedItemContent
  metadata: FeedItemMetadata
  context?: FeedItemContext
}

// API Response Types
export interface FeedResponse {
  items: FeedItem[]
  hasMore: boolean
  nextOffset: number
  total?: number
  context?: {
    location?: string
    timeOfDay?: string
    suggestions?: string[]
  }
}

export interface FeedFilters {
  type?: FeedItemType
  photographerId?: string
  difficulty?: DifficultyLevel
  context?: {
    lat?: number
    lng?: number
    time?: string
  }
}

// Saved Items (IndexedDB)
export interface SavedItem {
  id?: number // Auto-increment
  feedItemId: string
  savedAt: number
  notes?: string
}

// Challenge Types
export interface Challenge {
  id: string
  title: string
  description: string
  photographer: Photographer
  timeEstimate: string // "15 minutes", "1 hour"
  difficulty: DifficultyLevel
  prompts: string[] // Specific things to look for/capture
  exampleImage?: FeedItemImage
  completedBy?: number // Count of users who completed
}

// Mentor Chat Types
export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

export interface MentorSession {
  mentorId: string
  messages: ChatMessage[]
  startedAt: number
}

// User Store Types
export interface UserPreferences {
  theme: 'dark' | 'light'
  reducedMotion: boolean
  textSize: 'sm' | 'base' | 'lg'
}

export interface UserStats {
  itemsViewed: number
  itemsSaved: number
  challengesCompleted: number
  mentorChats: number
  lastVisit: number
}
