# ArtistFlow Setup Guide

Complete setup instructions for the ArtistFlow platform.

## Prerequisites

- Node.js v18 or higher
- npm or yarn
- Supabase account
- Google Cloud Console account
- Zapier account (optional)

## Step 1: Supabase Setup

1. Go to [Supabase](https://supabase.com) and create a new project
2. Copy your project URL and service role key
3. In Supabase SQL Editor, run the migration file:
   - Open `supabase/migrations/001_initial_schema.sql`
   - Copy and paste into Supabase SQL Editor
   - Execute the migration

## Step 2: Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable "Google Identity Services API"
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Configure:
   - Application type: Web application
   - Authorized JavaScript origins: `http://localhost:5173` (add production URL later)
   - Authorized redirect URIs: `http://localhost:5173`
6. Copy the Client ID

For React Native:
- Create separate OAuth clients for iOS and Android
- iOS: Bundle ID from your app
- Android: Package name and SHA-1 certificate fingerprint

## Step 3: Backend Setup

```bash
cd artistflow/backend
npm install
```

Create `.env` file:
```env
PORT=4000
JWT_SECRET=your-random-secret-key-here
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

Start backend:
```bash
npm start
```

## Step 4: Web Frontend Setup

```bash
cd artistflow/web
npm install
```

Create `.env` file:
```env
VITE_API_URL=http://localhost:4000
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

Start dev server:
```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

## Step 5: Mobile App Setup

```bash
cd artistflow/mobile
npm install
```

Install Expo CLI globally (if not already):
```bash
npm install -g expo-cli
```

Start Expo:
```bash
npx expo start
```

Scan QR code with Expo Go app on your phone, or press `i` for iOS simulator, `a` for Android emulator.

## Step 6: Zapier Integration (Optional)

1. Create a Zapier account
2. Create a new Zap
3. Set up webhook trigger:
   - Choose "Webhooks by Zapier"
   - Select "Catch Hook"
   - Copy the webhook URL
4. In your backend, configure Zapier webhook URL in environment variables
5. Set up actions:
   - Email notifications (Gmail, SendGrid)
   - Calendar sync (Google Calendar)
   - SMS reminders (Twilio)

Zapier webhook endpoints:
- `POST /api/webhooks/zapier/reminder` - For reminder automation
- `POST /api/webhooks/zapier/notification` - For general notifications
- `POST /api/webhooks/zapier/event-created` - Triggered when event is created

## Step 7: Testing

1. **Backend**: Check `http://localhost:4000` - should return `{"message":"ArtistFlow API","version":"1.0.0"}`
2. **Web**: Open `http://localhost:5173` - should show login page
3. **Mobile**: Run `npx expo start` and test on device/simulator

## Troubleshooting

### Backend won't start
- Check port 4000 is not in use
- Verify all environment variables are set
- Check Supabase connection

### Web app shows errors
- Verify backend is running
- Check browser console for errors
- Ensure environment variables are correct

### Mobile app issues
- Make sure Expo is installed
- Check that backend URL is accessible from your device
- For iOS: May need to configure network security settings

### Google OAuth not working
- Verify Client ID is correct
- Check authorized origins match your URL
- Ensure Google Identity API is enabled

## Next Steps

- Deploy backend to InfinityFree
- Deploy web frontend
- Build and publish mobile apps
- Set up production environment variables
- Configure custom domain

