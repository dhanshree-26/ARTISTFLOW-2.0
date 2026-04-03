# ArtistFlow API Documentation

Base URL: `http://localhost:4000/api` (development) or `https://your-api.com/api` (production)

## Authentication

All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## Endpoints

### Authentication

#### POST /auth/register
Register a new user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "role": "artist" // or "company"
}
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "artist"
  },
  "token": "jwt-token"
}
```

#### POST /auth/login
Login with email and password.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:** Same as register

#### POST /auth/google
Login/Register with Google OAuth.

**Request Body:**
```json
{
  "token": "google-id-token",
  "platform": "web" // or "ios", "android"
}
```

**Response:** Same as register

#### GET /auth/me
Get current user (requires authentication).

**Response:**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "name": "John Doe",
  "role": "artist",
  "artistProfile": { ... }
}
```

### Events

#### GET /events
Get events (filtered by user role).

**Query Parameters:**
- `status`: Filter by status (upcoming, completed, cancelled)
- `date_from`: Filter events from date (YYYY-MM-DD)
- `date_to`: Filter events to date (YYYY-MM-DD)

**Response:**
```json
[
  {
    "id": "uuid",
    "company_id": "uuid",
    "event_name": "Summer Festival",
    "venue": "Central Park",
    "date": "2024-08-24",
    "time": "18:00:00",
    "is_recurring": false,
    "total_slots": 5,
    "status": "upcoming"
  }
]
```

#### GET /events/:id
Get event details with slots.

**Response:**
```json
{
  "id": "uuid",
  "event_name": "Summer Festival",
  "venue": "Central Park",
  "date": "2024-08-24",
  "time": "18:00:00",
  "event_slots": [
    {
      "id": "uuid",
      "slot_number": 1,
      "slot_type": "Headliner",
      "status": "confirmed",
      "artist_profiles": { ... }
    }
  ]
}
```

#### POST /events
Create new event (companies only).

**Request Body:**
```json
{
  "event_name": "Summer Festival",
  "venue": "Central Park",
  "date": "2024-08-24",
  "time": "18:00:00",
  "is_recurring": false,
  "recurrence_type": "weekly",
  "recurrence_end_date": "2024-12-31",
  "total_slots": 5
}
```

#### PATCH /events/:id
Update event (companies only).

#### DELETE /events/:id
Delete event (companies only).

#### POST /events/:id/recurring
Create recurring event instances (companies only).

### Slots

#### GET /slots/events/:eventId/slots
Get slots for an event.

#### POST /slots/events/:eventId/slots
Assign artist to slot (companies only).

**Request Body:**
```json
{
  "artist_id": "uuid",
  "slot_number": 1,
  "slot_type": "Headliner"
}
```

#### PATCH /slots/:id
Update slot status.

**Request Body:**
```json
{
  "status": "confirmed" // or "pending", "declined"
}
```

#### DELETE /slots/:id
Remove artist from slot (companies only).

### Inquiries

#### GET /inquiries
Get inquiries (sent or received).

**Query Parameters:**
- `type`: "sent" or "received"
- `status`: "new", "responded", or "archived"

#### GET /inquiries/:id
Get inquiry details.

#### POST /inquiries
Create new inquiry.

**Request Body:**
```json
{
  "recipient_id": "uuid",
  "event_id": "uuid", // optional
  "subject": "Booking Request",
  "message": "I would like to book...",
  "tags": ["NEW", "FESTIVAL"]
}
```

#### PATCH /inquiries/:id
Update inquiry status (recipients only).

### Availability

#### GET /availability
Get availability calendar.

**Query Parameters:**
- `artist_id`: Filter by artist (companies only)
- `date_from`: Start date (YYYY-MM-DD)
- `date_to`: End date (YYYY-MM-DD)

#### POST /availability
Set availability (artists only).

**Request Body:**
```json
{
  "date": "2024-08-24",
  "status": "available", // or "unavailable"
  "time_slot": "full", // or "morning", "evening"
  "note": "Available all day"
}
```

#### PATCH /availability/:id
Update availability (artists only).

#### DELETE /availability/:id
Delete availability (artists only).

### Webhooks (Zapier)

#### POST /webhooks/zapier/reminder
Trigger reminder workflow.

**Headers:**
- `x-webhook-secret`: Webhook secret

**Request Body:**
```json
{
  "event_id": "uuid",
  "user_id": "uuid",
  "reminder_type": "t-2", // or "t-0"
  "scheduled_at": "2024-08-22T10:00:00Z"
}
```

#### POST /webhooks/zapier/notification
Send notification.

#### POST /webhooks/zapier/event-created
Trigger when event is created.

## Error Responses

All errors follow this format:

```json
{
  "error": "Error message"
}
```

**Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `500` - Internal Server Error

