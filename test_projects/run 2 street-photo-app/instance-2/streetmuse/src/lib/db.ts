import Dexie, { type Table } from 'dexie'
import type { SavedItem } from './types'

export class StreetMuseDB extends Dexie {
  savedItems!: Table<SavedItem>

  constructor() {
    super('StreetMuseDB')

    this.version(1).stores({
      savedItems: '++id, feedItemId, savedAt',
    })
  }
}

export const db = new StreetMuseDB()
