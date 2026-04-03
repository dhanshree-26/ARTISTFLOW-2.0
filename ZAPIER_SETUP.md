# Zapier Integration Setup

This guide explains how to set up Zapier workflows for ArtistFlow automation.

## Prerequisites

- Zapier account
- Backend API deployed and accessible
- Webhook secret configured in backend

## Webhook Endpoints

The backend provides these webhook endpoints for Zapier:

1. **POST /api/webhooks/zapier/reminder**
   - Trigger reminder workflow
   - Body: `{ event_id, user_id, reminder_type, scheduled_at }`

2. **POST /api/webhooks/zapier/notification**
   - Send notification
   - Body: `{ user_id, event_id, type, message }`

3. **POST /api/webhooks/zapier/event-created**
   - Trigger when event is created
   - Body: `{ event_id }`

## Setting Up Zapier Workflows

### Workflow 1: Event Reminder (T-2 Days)

1. **Trigger**: Schedule by Zapier
   - Schedule: Daily at 12:00 AM
   
2. **Action**: Webhooks by Zapier
   - Method: POST
   - URL: `https://your-api.com/api/webhooks/zapier/reminder`
   - Headers: `x-webhook-secret: your-secret`
   - Data: 
     ```json
     {
       "event_id": "{{event_id}}",
       "user_id": "{{user_id}}",
       "reminder_type": "t-2",
       "scheduled_at": "{{scheduled_at}}"
     }
     ```

3. **Action**: Email by Gmail/SendGrid
   - Send reminder email to user

### Workflow 2: Event Day Reminder (10 AM)

1. **Trigger**: Schedule by Zapier
   - Schedule: Daily at 10:00 AM
   
2. **Action**: Webhooks by Zapier
   - Same as above, but `reminder_type: "t-0"`

3. **Action**: Email by Gmail/SendGrid
   - Send "event is today" reminder

### Workflow 3: Google Calendar Sync

1. **Trigger**: Webhooks by Zapier (Catch Hook)
   - URL: `https://your-api.com/api/webhooks/zapier/event-created`
   
2. **Action**: Google Calendar - Create Event
   - Create calendar event from event data

## Webhook Security

Always use the `x-webhook-secret` header in your Zapier webhooks to authenticate requests.

Set `ZAPIER_WEBHOOK_SECRET` in your backend `.env` file and use the same value in Zapier webhook headers.

## Testing

1. Create a test event in ArtistFlow
2. Verify webhook is triggered
3. Check Zapier task history for success/failure
4. Verify email/calendar events are created

## Troubleshooting

- **401 Unauthorized**: Check webhook secret matches
- **404 Not Found**: Verify webhook URL is correct
- **500 Error**: Check backend logs for details
