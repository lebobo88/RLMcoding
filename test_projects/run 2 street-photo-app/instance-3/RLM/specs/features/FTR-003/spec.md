# FTR-003: Daily Challenges & Gamification

## Overview
Duolingo-style daily challenges with streak tracking, badges, and community voting.

## User Stories
- As a photographer, I want daily challenges so I practice consistently
- As a competitive person, I want streaks so I stay motivated
- As a learner, I want badges so I track my progress

## Acceptance Criteria
- [ ] 30 rotating daily challenges inspired by master techniques
- [ ] Streak tracker (current streak, longest streak)
- [ ] Challenge completion flow: view → accept → upload → submit
- [ ] AI analysis of submitted photos (composition, light, subject)
- [ ] Badge system (Bronze/Silver/Gold per photographer)
- [ ] Challenge calendar view
- [ ] Notification for streak breaking (future)
- [ ] Leaderboard (future, community feature)
- [ ] Filter by difficulty
- [ ] Accessible for screen readers

## Technical Design
**Route**: `/challenges`, `/challenges/[id]`
**Components**: ChallengeList, ChallengeCard, StreakTracker, BadgeDisplay, SubmissionForm
**Data Source**: Sanity CMS (challenges), PostgreSQL (user progress)
**Animation**: Badge unlock animation (scale + glow)

## Dependencies
- User authentication (future, mock for v1.0)
- Photo upload (Cloudinary)
