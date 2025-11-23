# MITC Web App - Complete Setup Guide

This guide will walk you through setting up the MITC Web App from scratch.

## 📚 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Firebase Setup](#firebase-setup)
3. [Cloudinary Setup](#cloudinary-setup)
4. [Local Development](#local-development)
5. [Deploy to Production](#deploy-to-production)
6. [Post-Deployment Configuration](#post-deployment-configuration)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Tools

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **npm** or **yarn**
- **Git** ([Download](https://git-scm.com/))
- **Firebase CLI**: `npm install -g firebase-tools`
- **Code Editor** (VS Code recommended)

### Required Accounts

- [Firebase Account](https://firebase.google.com/) (Free)
- [Cloudinary Account](https://cloudinary.com/) (Free)
- [GitHub Account](https://github.com/) (Free)

---

## Firebase Setup

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project"
3. Enter project name: `mitc-business` (or your choice)
4. Disable Google Analytics (optional)
5. Click "Create Project"

### Step 2: Enable Authentication

1. In Firebase Console, go to **Authentication**
2. Click "Get Started"
3. Enable **Email/Password**:
   - Click "Email/Password"
   - Toggle "Enable"
   - Save
4. Enable **Google**:
   - Click "Google"
   - Toggle "Enable"
   - Add project support email
   - Save

### Step 3: Create Firestore Database

1. Go to **Firestore Database**
2. Click "Create Database"
3. Choose **Production mode**
4. Select location (choose closest to your users)
5. Click "Enable"

### Step 4: Create Realtime Database

1. Go to **Realtime Database**
2. Click "Create Database"
3. Choose location
4. Start in **Locked mode**
5. Click "Enable"

### Step 5: Get Firebase Config

1. Go to **Project Settings** (gear icon)
2. Scroll to "Your apps"
3. Click web icon (</>)
4. Register app: `MITC Web App`
5. Copy the config object:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

---

## Cloudinary Setup

### Step 1: Create Account

1. Go to [Cloudinary](https://cloudinary.com/)
2. Sign up for free account
3. Verify email

### Step 2: Get Credentials

1. Go to Dashboard
2. Note down:
   - **Cloud Name**
   - **API Key**
   - **API Secret**

### Step 3: Create Upload Preset

1. Go to **Settings** → **Upload**
2. Scroll to "Upload presets"
3. Click "Add upload preset"
4. Configure:
   - Preset name: `mitc-uploads`
   - Signing mode: **Unsigned**
   - Folder: `mitc-products`
   - Allowed formats: `jpg, png, webp`
5. Save

---

## Local Development

### Step 1: Clone Repository

```bash
git clone https://github.com/Burhan-sheikh/mitc-business.git
cd mitc-business
```

### Step 2: Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install Cloud Functions dependencies
cd functions
npm install
cd ..
```

### Step 3: Configure Environment Variables

```bash
# Create .env file from example
cp .env.example .env
```

Edit `.env` and add your credentials:

```env
# Firebase
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Cloudinary
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=mitc-uploads
VITE_CLOUDINARY_API_KEY=your_api_key

# App
VITE_APP_NAME=MITC Web App
VITE_STORE_NAME=Mateen IT Corp
```

### Step 4: Initialize Firebase

```bash
# Login to Firebase
firebase login

# Initialize project
firebase init
```

Select:
- ☑ Firestore
- ☑ Realtime Database  
- ☑ Functions
- ☑ Hosting

When prompted:
- Use existing project: Select your project
- Firestore rules: `firestore.rules`
- Firestore indexes: `firestore.indexes.json`
- RTDB rules: `database.rules.json`
- Functions language: JavaScript
- Functions source: `functions`
- Public directory: `dist`
- Single-page app: Yes
- Overwrite files: No

### Step 5: Deploy Security Rules

```bash
# Deploy Firestore rules
firebase deploy --only firestore:rules

# Deploy RTDB rules
firebase deploy --only database
```

### Step 6: Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Deploy to Production

### Step 1: Configure Cloud Functions

```bash
# Set Cloudinary config for functions
firebase functions:config:set \
  cloudinary.cloud_name="YOUR_CLOUD_NAME" \
  cloudinary.api_key="YOUR_API_KEY" \
  cloudinary.api_secret="YOUR_API_SECRET"
```

### Step 2: Deploy Functions

```bash
firebase deploy --only functions
```

### Step 3: Build and Deploy Frontend

```bash
# Build for production
npm run build

# Deploy to Firebase Hosting
firebase deploy --only hosting
```

Your app is now live at:
`https://YOUR_PROJECT_ID.web.app`

---

## Post-Deployment Configuration

### Step 1: Create Admin User

1. Go to your deployed app
2. Sign up with email/password
3. Go to Firebase Console → Firestore
4. Find your user in `users` collection
5. Edit the document:
   ```json
   {
     "role": "admin"
   }
   ```
6. Save

### Step 2: Add Store Information

The store details are already configured in `src/config/store.js` with Mateen IT Corp information. To customize:

1. Open `src/config/store.js`
2. Update store details as needed
3. Rebuild and redeploy

### Step 3: Configure Firestore Indexes

When you see index errors in console:

1. Click the provided link, OR
2. Go to Firebase Console → Firestore → Indexes
3. Create the required composite indexes

### Step 4: Test All Features

☑ User registration and login
☑ Google OAuth
☑ Product browsing
☑ Product detail pages
☑ Live chat
☑ Review submission
☑ Admin dashboard
☑ Product management
☑ Image upload
☑ PWA installation

---

## Troubleshooting

### Common Issues

#### "Permission denied" errors

**Solution**: Deploy security rules
```bash
firebase deploy --only firestore:rules,database
```

#### "Missing index" errors

**Solution**: Create composite indexes
- Click the error link
- Or manually create in Firebase Console

#### Images not uploading

**Solution**: Check Cloudinary preset
- Verify upload preset is "Unsigned"
- Check API credentials in `.env`
- Ensure Cloud Functions are deployed

#### "Module not found" errors

**Solution**: Reinstall dependencies
```bash
rm -rf node_modules package-lock.json
npm install
```

#### Build errors

**Solution**: Check environment variables
- All `VITE_` prefixed variables in `.env`
- No syntax errors in `.env`
- Rebuild: `npm run build`

### Get Help

- Check [GitHub Issues](https://github.com/Burhan-sheikh/mitc-business/issues)
- Email: mateencorp@gmail.com
- WhatsApp: +91 8082754459

---

## Next Steps

1. Customize themes in `src/styles/themes/`
2. Add your products via admin panel
3. Configure store hours and details
4. Set up analytics
5. Monitor performance

🎉 **Congratulations!** Your MITC Web App is now live!
