# ArtistFlow - Artist Management Platform

Full-stack platform for managing artist bookings, events, and inquiries with role-based dashboards, availability calendars, slot management, and automated reminders.

## Tech Stack

- **Frontend Web**: React + Vite + Tailwind CSS
- **Mobile App**: React Native (Expo)
- **Backend**: Node.js + Express
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Google OAuth (web + mobile)
- **Automation**: Zapier (reminders, integrations)
- **Version Control**: GitHub
- **Hosting**: InfinityFree

## Project Structure

```
artistflow/
├── web/                  # React web application
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Page components
│   │   ├── layouts/      # Layout components
│   │   ├── contexts/     # React contexts
│   │   └── utils/        # Helper functions
│   └── package.json
├── mobile/               # React Native mobile app
│   ├── src/
│   │   ├── screens/      # Screen components
│   │   ├── components/   # Reusable components
│   │   ├── navigation/   # Navigation setup
│   │   └── services/     # API services
│   └── package.json
├── backend/              # Node.js + Express API
│   ├── src/
│   │   ├── routes/       # API routes
│   │   ├── middleware/   # Auth, validation
│   │   ├── services/     # Business logic
│   │   ├── config/       # Supabase, Google Auth
│   │   └── server.js
│   └── package.json
├── supabase/             # Database migrations
│   └── migrations/
└── README.md
```

## Features

### For Artists
- Profile management
- Availability calendar (mark available/unavailable dates)
- View assigned events
- Accept/decline slot assignments
- Receive automated reminders
- Inquiry management

### For Companies
- Event creation and management
- Recurring events support
- Slot management (assign artists to slots)
- Artist directory
- Roster tracking
- Automated reminders for events

### Automation
- Reminder emails (T-2 days, T-0 10 AM)
- Google Calendar sync
- Email notifications
- Zapier webhook integration

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Supabase account
- Google Cloud Console account (for OAuth)
- Zapier account (for automation)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd artistflow
   ```

2. **Set up Supabase**
   - Create a Supabase project
   - Run the migration file: `supabase/migrations/001_initial_schema.sql`
   - Get your Supabase URL and keys

3. **Configure Google OAuth**
   - Follow instructions in `GOOGLE_OAUTH_SETUP.md`
   - Get Client IDs for web, iOS, and Android

4. **Install dependencies**
   ```bash
   # Backend
   cd backend && npm install
   
   # Web
   cd ../web && npm install
   
   # Mobile
   cd ../mobile && npm install
   ```

5. **Set up environment variables**
   - Backend: Copy `backend/.env.example` to `backend/.env` and fill in values
   - Web: Create `web/.env` with frontend variables
   - See setup guides for details

6. **Run development servers**
   ```bash
   # Terminal 1 - Backend
   cd backend && npm run dev
   
   # Terminal 2 - Web
   cd web && npm run dev
   
   # Terminal 3 - Mobile
   cd mobile && npm start
   ```

## Documentation

- **[API Documentation](API_DOCUMENTATION.md)** - Complete API reference
- **[Google OAuth Setup](GOOGLE_OAUTH_SETUP.md)** - OAuth configuration guide
- **[Zapier Setup](ZAPIER_SETUP.md)** - Automation workflow setup
- **[Deployment Guide](DEPLOYMENT.md)** - Production deployment instructions
- **[Supabase Setup](supabase/README.md)** - Database setup guide

## Development

### Backend API
- Runs on `http://localhost:4000`
- API routes: `/api/*`
- Uses JWT for authentication
- Supabase for database operations

### Web Application
- Runs on `http://localhost:5173`
- React Router for navigation
- Tailwind CSS for styling
- Matches design images exactly

### Mobile Application
- Expo development server
- React Navigation for routing
- Native Google OAuth
- Same functionality as web app

## License

MIT
