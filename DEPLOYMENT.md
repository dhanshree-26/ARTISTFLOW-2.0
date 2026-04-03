# Deployment Guide

## InfinityFree Hosting

### Backend Deployment

1. **Prepare Backend**:
   - Ensure all dependencies are in `package.json`
   - Set up environment variables
   - Test locally first

2. **Upload to InfinityFree**:
   - Use FTP client (FileZilla, etc.)
   - Upload `backend/` folder to your domain
   - Note: InfinityFree may require PHP, consider alternative hosting for Node.js

3. **Alternative Backend Hosting**:
   - Consider Railway, Render, or Heroku for Node.js backend
   - Update frontend API URL to point to backend

### Web Frontend Deployment

1. **Build Production Bundle**:
   ```bash
   cd web
   npm run build
   ```

2. **Upload to InfinityFree**:
   - Upload `web/dist/` contents to your domain root
   - Configure `.htaccess` for SPA routing (if needed)

3. **Environment Variables**:
   - Set `VITE_API_URL` to your backend URL
   - Set `VITE_GOOGLE_CLIENT_ID` for OAuth
   - Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`

### Domain Configuration

1. **Point Domain**:
   - Update DNS records to point to InfinityFree
   - Wait for DNS propagation (24-48 hours)

2. **SSL Certificate**:
   - InfinityFree provides free SSL
   - Enable in control panel

## Mobile App Deployment

### Expo Build

1. **Configure app.json**:
   ```json
   {
     "expo": {
       "name": "ArtistFlow",
       "slug": "artistflow",
       "version": "1.0.0",
       "ios": {
         "bundleIdentifier": "com.artistflow.app"
       },
       "android": {
         "package": "com.artistflow.app"
       }
     }
   }
   ```

2. **Build for iOS**:
   ```bash
   expo build:ios
   ```

3. **Build for Android**:
   ```bash
   expo build:android
   ```

4. **Submit to Stores**:
   - iOS: App Store Connect
   - Android: Google Play Console

## Environment Variables Checklist

### Backend (.env)
- `PORT`
- `JWT_SECRET`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `GOOGLE_CLIENT_ID_WEB`
- `GOOGLE_CLIENT_ID_IOS`
- `GOOGLE_CLIENT_ID_ANDROID`
- `ZAPIER_WEBHOOK_SECRET`

### Web Frontend (.env)
- `VITE_API_URL`
- `VITE_GOOGLE_CLIENT_ID`
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## Post-Deployment

1. Test all features
2. Verify OAuth works
3. Test API endpoints
4. Check mobile app connectivity
5. Monitor error logs
