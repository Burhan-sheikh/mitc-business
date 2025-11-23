# Deployment Guide - MITC Web App

This guide covers deployment options for the MITC Web App.

## Prerequisites

- Node.js 18+ installed
- Firebase CLI installed (`npm install -g firebase-tools`)
- Firebase project created
- Cloudinary account set up

## Environment Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Burhan-sheikh/mitc-business.git
   cd mitc-business
   ```

2. **Install dependencies**
   ```bash
   npm install
   cd functions && npm install && cd ..
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your credentials:
   - Firebase configuration
   - Cloudinary credentials
   - App settings

## Firebase Setup

### 1. Initialize Firebase

```bash
firebase login
firebase init
```

Select:
- Firestore
- Realtime Database
- Functions
- Hosting

### 2. Deploy Security Rules

```bash
firebase deploy --only firestore:rules
firebase deploy --only database
```

### 3. Deploy Cloud Functions

```bash
# Set Cloudinary config
firebase functions:config:set \
  cloudinary.cloud_name="YOUR_CLOUD_NAME" \
  cloudinary.api_key="YOUR_API_KEY" \
  cloudinary.api_secret="YOUR_API_SECRET"

# Deploy functions
cd functions
npm install
cd ..
firebase deploy --only functions
```

### 4. Create Initial Admin User

After deployment:
1. Sign up for an account in your app
2. Go to Firebase Console → Firestore
3. Find your user document in `users` collection
4. Change `role` field from `user` to `admin`

## Build and Deploy

### Option 1: Firebase Hosting

```bash
# Build the app
npm run build

# Deploy to Firebase Hosting
firebase deploy --only hosting
```

Your app will be available at:
`https://YOUR_PROJECT_ID.web.app`

### Option 2: Netlify

1. **Connect GitHub repository**
   - Go to Netlify dashboard
   - Click "New site from Git"
   - Connect your GitHub repository

2. **Configure build settings**
   - Build command: `npm run build`
   - Publish directory: `dist`

3. **Add environment variables**
   - Go to Site settings → Environment variables
   - Add all variables from `.env.example`

4. **Deploy**
   - Netlify will automatically deploy on push to main

### Option 3: Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

Follow the prompts to:
- Link to your project
- Configure environment variables
- Deploy

## Post-Deployment

### 1. Configure Firestore Indexes

When you see index errors:
- Click the provided link in the console
- Or manually create indexes in Firebase Console

### 2. Test Features

- [ ] User registration and login
- [ ] Google OAuth
- [ ] Product browsing and search
- [ ] Product detail pages
- [ ] Live chat functionality
- [ ] Review submission
- [ ] Admin dashboard access
- [ ] Product management
- [ ] Image upload
- [ ] PWA installation
- [ ] Offline functionality

### 3. Monitor Performance

- Firebase Console → Performance
- Check function execution times
- Monitor database queries
- Review hosting metrics

### 4. Set Up Analytics

```javascript
// In src/config/firebase.js
import { getAnalytics } from 'firebase/analytics'

if (import.meta.env.PROD) {
  const analytics = getAnalytics(app)
}
```

## Production Checklist

- [ ] Environment variables configured
- [ ] Firebase rules deployed
- [ ] Cloud Functions deployed
- [ ] Cloudinary configured
- [ ] Admin user created
- [ ] Store information updated in `src/config/store.js`
- [ ] Theme presets configured
- [ ] All features tested
- [ ] PWA icons generated
- [ ] SEO meta tags updated
- [ ] Error monitoring set up
- [ ] Backup strategy in place

## Rollback

If you need to rollback:

```bash
# View previous releases
firebase hosting:channel:list

# Rollback to previous version
firebase hosting:clone SOURCE_SITE_ID:SOURCE_CHANNEL_ID \
  TARGET_SITE_ID:live
```

## Troubleshooting

### Build Errors

```bash
# Clear cache and rebuild
rm -rf node_modules dist .firebase
npm install
npm run build
```

### Function Deployment Errors

```bash
# Check function logs
firebase functions:log

# Redeploy specific function
firebase deploy --only functions:functionName
```

### Firestore Rules Errors

- Check rules in Firebase Console
- Test rules with Firebase Emulator
- Verify user roles are set correctly

## Monitoring

### Firebase Console
- Authentication → Users
- Firestore → Data
- Functions → Logs
- Hosting → Usage

### Error Tracking

Consider integrating:
- Sentry for error tracking
- LogRocket for session replay
- Google Analytics for user behavior

## Support

For deployment issues:
- Check Firebase documentation
- Open an issue on GitHub
- Contact: mateencorp@gmail.com

---

**Note**: Always test in a development environment before deploying to production.
