# ArtistFlow Mobile App

React Native mobile application for ArtistFlow platform.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Install React Navigation and other required packages:
```bash
npm install @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs
npm install react-native-screens react-native-safe-area-context
npm install @react-native-google-signin/google-signin
```

3. For iOS:
```bash
cd ios && pod install && cd ..
```

4. Start the development server:
```bash
npm start
```

## Project Structure

```
mobile/
├── src/
│   ├── screens/        # Screen components
│   ├── components/     # Reusable components
│   ├── navigation/     # Navigation setup
│   └── services/        # API services
└── App.js              # Main app entry
```

## Features

- Dashboard screen
- Events management
- Event slots
- Inquiries
- Google OAuth authentication
- Push notifications (to be configured)

## Building

### iOS
```bash
npm run ios
# or
expo build:ios
```

### Android
```bash
npm run android
# or
expo build:android
```

