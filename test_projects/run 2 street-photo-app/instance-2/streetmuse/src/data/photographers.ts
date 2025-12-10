import type { Photographer } from '@/lib/types'

export const photographers: Record<string, Photographer> = {
  'cartier-bresson': {
    id: 'cartier-bresson',
    name: 'Henri Cartier-Bresson',
    yearsActive: '1930-2004',
    nationality: 'French',
    specialty: ['Decisive Moment', 'Composition', 'Geometry'],
    bio: 'Father of modern photojournalism and master of the decisive moment. Founded Magnum Photos in 1947.',
    color: '#3A5A7F',
    quote: 'Your eye must see a composition or an expression that life itself offers you, and you must know with intuition when to click the camera.',
  },
  'maier': {
    id: 'maier',
    name: 'Vivian Maier',
    yearsActive: '1950s-1990s',
    nationality: 'American',
    specialty: ['Candid Photography', 'Self-Portraits', 'Human Nature'],
    bio: 'Enigmatic nanny and photographer whose work was discovered posthumously. Master of candid street photography.',
    color: '#6B4E71',
    quote: 'A camera is a tool for learning how to see without a camera.',
  },
  'winogrand': {
    id: 'winogrand',
    name: 'Garry Winogrand',
    yearsActive: '1950s-1984',
    nationality: 'American',
    specialty: ['Energy', 'Chaos', 'American Life'],
    bio: 'Prolific photographer who captured the energy and chaos of American life in the 1960s-70s.',
    color: '#8B5A3C',
    quote: 'I photograph to see what the world looks like in photographs.',
  },
  'arbus': {
    id: 'arbus',
    name: 'Diane Arbus',
    yearsActive: '1940s-1971',
    nationality: 'American',
    specialty: ['Portraits', 'Unconventional Subjects', 'Emotional Depth'],
    bio: 'Known for photographs of people on the margins of society, revealing profound humanity.',
    color: '#8B2635',
    quote: 'A photograph is a secret about a secret. The more it tells you, the less you know.',
  },
  'erwitt': {
    id: 'erwitt',
    name: 'Elliott Erwitt',
    yearsActive: '1940s-present',
    nationality: 'American-French',
    specialty: ['Wit', 'Humor', 'Irony'],
    bio: 'Master of wit and humor in photography, finding irony and absurdity in everyday moments.',
    color: '#5A7D5F',
    quote: 'Photography is an art of observation. It has little to do with the things you see and everything to do with the way you see them.',
  },
}

export const getPhotographerById = (id: string): Photographer | undefined => {
  return photographers[id]
}

export const getAllPhotographers = (): Photographer[] => {
  return Object.values(photographers)
}
