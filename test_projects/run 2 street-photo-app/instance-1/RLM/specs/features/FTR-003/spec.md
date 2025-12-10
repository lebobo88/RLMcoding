# Feature: Daily Muse Notification (FTR-003)

**Priority**: P1 (Should Have)
**Status**: Active
**Estimated Effort**: 1 week

## Overview

One beautifully designed daily notification delivering a powerful insight, quote, or challenge from a master photographer at the user's optimal time (learned or golden hour default).

## User Stories

1. As a busy photographer, I want one daily notification so that I stay inspired without overwhelm
2. As an evening shooter, I want notifications at golden hour so that they arrive when I'm likely to photograph
3. As a morning person, I want to customize notification time so that it fits my schedule

## Acceptance Criteria

- [ ] Single daily notification (max 1 per day, never spam)
- [ ] Rich notification: Thumbnail image + title + snippet
- [ ] Tap notification → opens app to full insight card
- [ ] Notification time intelligence:
  - Default: 1 hour before sunset (golden hour)
  - Learns user's typical photo walk times (if pattern detected)
  - Manual override in settings
- [ ] Adapts to timezone changes automatically
- [ ] Seasonal daylight adjustments (golden hour shifts)
- [ ] Enable/disable in settings
- [ ] Preview notification time in settings: "Next Muse: Today at 5:42 PM"
- [ ] Notification content rotates daily (never repeats in 30 days)
- [ ] Fallback to app badge if notifications disabled

## Technical Implementation

### Notification Service (Capacitor)
```typescript
import { LocalNotifications } from '@capacitor/local-notifications';

async function scheduleDailyMuse(userId: string) {
  const user = await getUser(userId);
  const timezone = user.timezone;
  const goldenHourTime = calculateGoldenHour(timezone); // e.g., 17:42

  await LocalNotifications.schedule({
    notifications: [{
      id: 1,
      title: "Your Daily Muse",
      body: "Cartier-Bresson: 'Your first 10,000 photographs are your worst.'",
      largeIcon: "https://cdn.streetmuse.app/insights/thumb-123.jpg",
      schedule: {
        on: { hour: goldenHourTime.hour, minute: goldenHourTime.minute },
        repeats: true,
        every: 'day'
      },
      extra: { insightId: "uuid-123" }
    }]
  });
}
```

### Data Schema
```sql
ALTER TABLE users ADD COLUMN notification_enabled BOOLEAN DEFAULT true;
ALTER TABLE users ADD COLUMN notification_time TIME; -- Manual override
ALTER TABLE users ADD COLUMN last_notification_sent TIMESTAMP;
```

### API Endpoints
- `POST /api/notifications/enable` - Enable notifications
- `POST /api/notifications/disable` - Disable notifications
- `PUT /api/notifications/time` - Set custom time
- `GET /api/notifications/preview` - Get next notification time

### Cron Job (Vercel)
```javascript
// api/cron/daily-muse.ts
export default async function handler(req, res) {
  const users = await getNotificationEnabledUsers();

  for (const user of users) {
    const insight = await getRandomInsight(user.id); // Never sent in last 30 days
    await sendNotification(user, insight);
  }

  res.status(200).json({ sent: users.length });
}
```

## Dependencies
- Capacitor Local Notifications
- Vercel Cron Jobs (daily trigger)
- SunCalc.js (golden hour calculations)

## Risks
- **Notification fatigue**: Limit to 1/day strictly, provide easy disable
- **Permission denial**: Gracefully handle, offer in-app reminder banner instead
