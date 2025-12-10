import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { UserPreferences, UserStats } from '../types'

interface UserStore {
  // Preferences
  preferences: UserPreferences
  setTheme: (theme: 'dark' | 'light') => void
  toggleTheme: () => void
  setReducedMotion: (enabled: boolean) => void
  setTextSize: (size: 'sm' | 'base' | 'lg') => void

  // Saved Items
  savedItemIds: string[]
  addSavedItem: (id: string) => void
  removeSavedItem: (id: string) => void
  isSaved: (id: string) => boolean

  // Stats
  stats: UserStats
  incrementViewed: () => void
  incrementSaved: () => void
  incrementChallengesCompleted: () => void
  incrementMentorChats: () => void
  updateLastVisit: () => void
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      // Default Preferences
      preferences: {
        theme: 'dark',
        reducedMotion: false,
        textSize: 'base',
      },

      setTheme: (theme) =>
        set((state) => ({
          preferences: { ...state.preferences, theme },
        })),

      toggleTheme: () =>
        set((state) => ({
          preferences: {
            ...state.preferences,
            theme: state.preferences.theme === 'dark' ? 'light' : 'dark',
          },
        })),

      setReducedMotion: (enabled) =>
        set((state) => ({
          preferences: { ...state.preferences, reducedMotion: enabled },
        })),

      setTextSize: (size) =>
        set((state) => ({
          preferences: { ...state.preferences, textSize: size },
        })),

      // Saved Items
      savedItemIds: [],

      addSavedItem: (id) =>
        set((state) => {
          if (state.savedItemIds.includes(id)) return state
          return {
            savedItemIds: [...state.savedItemIds, id],
          }
        }),

      removeSavedItem: (id) =>
        set((state) => ({
          savedItemIds: state.savedItemIds.filter((itemId) => itemId !== id),
        })),

      isSaved: (id) => get().savedItemIds.includes(id),

      // Stats
      stats: {
        itemsViewed: 0,
        itemsSaved: 0,
        challengesCompleted: 0,
        mentorChats: 0,
        lastVisit: Date.now(),
      },

      incrementViewed: () =>
        set((state) => ({
          stats: { ...state.stats, itemsViewed: state.stats.itemsViewed + 1 },
        })),

      incrementSaved: () =>
        set((state) => ({
          stats: { ...state.stats, itemsSaved: state.stats.itemsSaved + 1 },
        })),

      incrementChallengesCompleted: () =>
        set((state) => ({
          stats: {
            ...state.stats,
            challengesCompleted: state.stats.challengesCompleted + 1,
          },
        })),

      incrementMentorChats: () =>
        set((state) => ({
          stats: { ...state.stats, mentorChats: state.stats.mentorChats + 1 },
        })),

      updateLastVisit: () =>
        set((state) => ({
          stats: { ...state.stats, lastVisit: Date.now() },
        })),
    }),
    {
      name: 'streetmuse-user',
    }
  )
)
