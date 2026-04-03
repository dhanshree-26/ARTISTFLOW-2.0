# Google OAuth Setup Guide

This guide covers setting up Google OAuth for both web and mobile applications.

## Prerequisites

- Google Cloud Console account
- Access to create OAuth 2.0 credentials

## Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable "Google Identity Services API" or "Google+ API"

## Step 2: Configure OAuth Consent Screen

1. Go to "APIs & Services" → "OAuth consent screen"
2. Select "External" (unless you have Google Workspace)
3. Fill in required information:
   - App name: ArtistFlow
   - User support email: Your email
   - Developer contact: Your email
4. Add scopes: `email`, `profile`, `openid`
5. Save and continue through all steps

## Step 3: Create OAuth Credentials

### For Web Application

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth client ID"
3. Application type: **Web application**
4. Name: "ArtistFlow Web Client"
5. Authorized JavaScript origins:
   - `http://localhost:5173` (development)
   - `https://yourdomain.com` (production)
6. Authorized redirect URIs:
   - `http://localhost:5173` (development)
   - `https://yourdomain.com/auth/callback` (production)
7. Click "Create" and **copy the Client ID**

### For iOS Application

1. Create another OAuth client ID
2. Application type: **iOS**
3. Name: "ArtistFlow iOS"
4. Bundle ID: Your iOS app bundle ID (e.g., `com.artistflow.app`)
5. Click "Create" and **copy the Client ID**

### For Android Application

1. Create another OAuth client ID
2. Application type: **Android**
3. Name: "ArtistFlow Android"
4. Package name: Your Android package name (e.g., `com.artistflow.app`)
5. SHA-1 certificate fingerprint: Get from your keystore
6. Click "Create" and **copy the Client ID**

## Step 4: Configure Environment Variables

### Backend (.env)

```env
GOOGLE_CLIENT_ID_WEB=your-web-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_ID_IOS=your-ios-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_ID_ANDROID=your-android-client-id.apps.googleusercontent.com
```

### Web Frontend (.env)

```env
VITE_GOOGLE_CLIENT_ID=your-web-client-id.apps.googleusercontent.com
```

### Mobile App (app.json or config)

Add to your React Native app configuration:
```json
{
  "expo": {
    "extra": {
      "googleClientId": "your-web-client-id.apps.googleusercontent.com"
    }
  }
}
```

## Step 5: Install Required Packages

### Backend
```bash
npm install google-auth-library
```

### Web Frontend
The Google Sign-In script is loaded via CDN in `index.html`

### Mobile
```bash
npm install @react-native-google-signin/google-signin
# or for Expo
expo install expo-auth-session expo-crypto
```

## Testing

1. **Web**: Test login at `http://localhost:5173`
2. **Mobile**: Test on iOS simulator/device and Android emulator/device
3. Verify tokens are being sent to backend correctly
4. Check backend verification is working

## Troubleshooting

- **"Invalid client"**: Check Client IDs match exactly
- **"Redirect URI mismatch"**: Verify redirect URIs in Google Console
- **Mobile errors**: Ensure bundle ID/package name matches exactly
- **Backend verification fails**: Check GOOGLE_CLIENT_ID matches the platform

