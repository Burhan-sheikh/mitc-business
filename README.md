# MITC Web App - Mateen IT Corp

> Premium laptop showroom web application for Srinagar, Kashmir

## 🎯 Overview

MITC Web App is a modern, production-ready web application for Mateen IT Corp's laptop showroom. Built with React and Firebase, it provides a complete solution for showcasing products, managing customers, and collecting reviews.

## ✨ Key Features

### Public Features
- **Product Browsing** - Browse laptops by category, brand, and features
- **Smart Search & Filters** - Find exactly what you need
- **Product Details** - Complete specifications, image gallery, and stock info
- **Contact Options** - WhatsApp, Instagram, Facebook, Email integration
- **PWA Support** - Install on mobile devices
- **15-Day Warranty Info** - Clear warranty communication
- **Store Reviews** - Customer testimonials and ratings

### Admin Features
- **Customer Management** - Track purchases and 15-day warranties
- **Product Management** - Full CRUD with image upload
- **Review Moderation** - Approve/reject store reviews
- **Site Settings** - Manage branding, pages, and contact templates
- **Product Limits** - Enforced limits per section (80 total)
- **Analytics Dashboard** - Quick overview of key metrics

## 🛠️ Tech Stack

- **Frontend**: React 18, Tailwind CSS, Framer Motion
- **Backend**: Firebase Auth, Firestore
- **Media**: Cloudinary (image hosting & optimization)
- **Build**: Vite
- **PWA**: Vite-PWA plugin

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm
- Firebase project
- Cloudinary account

### Steps

1. **Clone the repository**
```bash
git clone https://github.com/Burhan-sheikh/mitc-business.git
cd mitc-business
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
```

Edit `.env` with your credentials:
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
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
VITE_CLOUDINARY_API_KEY=your_api_key
```

4. **Start development server**
```bash
npm run dev
```

Open http://localhost:3000

## 🔥 Firebase Setup

### 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create new project
3. Enable Authentication (Email/Password and Google)
4. Create Firestore database
5. Get your config from Project Settings

### 2. Firestore Collections

Create these collections:
- `products` - Product catalog
- `customers` - Customer records with warranties
- `storeReviews` - Store reviews
- `siteSettings` - Site configuration
- `users` - User accounts with roles

### 3. Create Admin User

1. Sign up through the app
2. Go to Firestore Console
3. Find your user in `users` collection
4. Change `role` field to `admin`

### 4. Security Rules (Optional but recommended)

Add Firestore security rules to protect your data.

## ☁️ Cloudinary Setup

1. Create account at [Cloudinary](https://cloudinary.com/)
2. Get your Cloud Name from Dashboard
3. Go to Settings → Upload
4. Create unsigned upload preset
5. Copy preset name to `.env`

## 📱 PWA Installation

The app is installable on mobile devices:
1. Open in Chrome/Safari
2. Tap "Add to Home Screen"
3. Works offline with cached data

## 🎨 Customization

### Branding
Update store info in Admin → Site Settings → Branding

### Pages
Edit About, Terms, Privacy, Contact pages in Admin → Site Settings → Pages

### Contact Templates
10 customizable message templates for product inquiries

## 📊 Product Limits (As Per Spec)

- **Total Products**: 80 maximum
- **Top Highlights**: 10
- **Deals**: 10
- **New Arrivals**: 10
- **Limited Stock**: 10
- **Category Grid**: 30 (Premium/Standard/Basic)
- **Bottom Highlights**: 10

## 🚀 Build & Deploy

### Build for production
```bash
npm run build
```

### Deploy to Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

### Deploy to Netlify
1. Connect GitHub repo
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables

## 📞 Store Details (Pre-configured)

- **Name**: Mateen IT Corp
- **Location**: Maisuma, Near Gaw Kadal Bridge, Srinagar - 190001
- **Phone**: +91 8082754459
- **Email**: mateencorp@gmail.com
- **Instagram**: @mitc.usedlaptops
- **15-Day Testing Warranty** on all laptops

## 🛡️ Security

- Role-based access (Admin, User, Guest)
- Firebase Authentication
- Protected admin routes
- Input validation
- Image compression (< 700KB)

## 📝 License

MIT License - See LICENSE file

## 👨‍💻 Developer

Built by Burhan Sheikh for Mateen IT Corp

## 📧 Support

- Email: mateencorp@gmail.com
- WhatsApp: +91 8082754459
- Instagram: @mitc.usedlaptops

---

**Made with ❤️ in Kashmir**