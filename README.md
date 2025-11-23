# 🏬 MITC Web App

> A modern showroom-style retail web application for **Mateen IT Corp**, Srinagar, Kashmir.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![PWA Ready](https://img.shields.io/badge/PWA-Ready-purple.svg)

## 🌟 Overview

MITC Web App is a production-quality, PWA-ready retail platform for browsing products, checking in-store stock, live chat support, reviews, and comprehensive admin management. **No online ordering** - this is a digital showroom experience.

### ✨ Key Features

**For Customers:**
- 🔍 Browse products with smart search & filters
- 📱 Product details with image gallery, specs, and stock availability
- 💬 Live chat support with real-time messaging
- ⭐ Reviews & ratings system
- 🎨 6-8 premium theme presets
- 📲 PWA support (works offline, installable)
- 👤 Guest browsing + authenticated accounts
- 🔐 Email/Password + Google OAuth

**For Admins:**
- 📊 Comprehensive dashboard with analytics
- 🛍️ Product management (CRUD operations)
- 🖼️ Image upload with automatic compression
- 💬 Chat moderation & monitoring
- 👥 User & review management
- 📥 CSV/JSON import with preview
- 📤 Export capabilities
- ⚙️ Store settings & configuration

---

## 🚀 Tech Stack

### Frontend
- **React 18** + **Vite**
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **React Router** for navigation
- **Vite-PWA** for progressive web app features

### Backend & Cloud
- **Firebase Authentication** (Email/Password + Google OAuth)
- **Cloud Firestore** (database)
- **Firebase Realtime Database** (live chat)
- **Firebase Cloud Functions** (Node.js 18)
- **Cloudinary** (image hosting & optimization)

### Mobile (Future)
- **React Native** (Expo) for Play Store release

---

## 📦 Installation

### Prerequisites
- Node.js 18+
- npm or yarn
- Firebase project
- Cloudinary account

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/Burhan-sheikh/mitc-business.git
   cd mitc-business
   ```

2. **Install dependencies**
   ```bash
   # Install frontend dependencies
   npm install

   # Install Cloud Functions dependencies
   cd functions
   npm install
   cd ..
   ```

3. **Configure Firebase**
   - Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
   - Enable Authentication (Email/Password + Google)
   - Create Firestore database
   - Create Realtime Database
   - Copy your Firebase config

4. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your Firebase and Cloudinary credentials:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
   VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
   ```

5. **Deploy Firestore Security Rules**
   ```bash
   firebase deploy --only firestore:rules
   ```

6. **Deploy Cloud Functions**
   ```bash
   firebase deploy --only functions
   ```

7. **Run the development server**
   ```bash
   npm run dev
   ```

8. **Build for production**
   ```bash
   npm run build
   ```

---

## 📁 Project Structure

```
mitc-business/
├── public/
│   ├── icons/              # PWA icons
│   ├── manifest.json       # PWA manifest
│   └── robots.txt
├── src/
│   ├── components/         # React components
│   │   ├── admin/          # Admin-specific components
│   │   ├── auth/           # Authentication components
│   │   ├── chat/           # Live chat components
│   │   ├── common/         # Shared components
│   │   ├── products/       # Product-related components
│   │   └── reviews/        # Review components
│   ├── config/
│   │   ├── firebase.js     # Firebase configuration
│   │   └── cloudinary.js   # Cloudinary configuration
│   ├── contexts/           # React contexts
│   │   ├── AuthContext.jsx
│   │   ├── ThemeContext.jsx
│   │   └── ChatContext.jsx
│   ├── hooks/              # Custom React hooks
│   ├── pages/              # Page components
│   │   ├── Home.jsx
│   │   ├── ProductDetail.jsx
│   │   ├── StoreInfo.jsx
│   │   ├── admin/
│   │   └── auth/
│   ├── services/           # API & Firebase services
│   │   ├── authService.js
│   │   ├── productService.js
│   │   ├── chatService.js
│   │   └── reviewService.js
│   ├── styles/             # Global styles & themes
│   │   ├── themes/         # Theme presets (JSON)
│   │   └── globals.css
│   ├── utils/              # Utility functions
│   │   ├── imageCompression.js
│   │   ├── validation.js
│   │   └── helpers.js
│   ├── App.jsx
│   └── main.jsx
├── functions/              # Firebase Cloud Functions
│   ├── src/
│   │   ├── imageProcessing.js
│   │   ├── cleanup.js
│   │   └── index.js
│   └── package.json
├── firestore.rules         # Firestore security rules
├── database.rules.json     # RTDB security rules
├── firebase.json           # Firebase configuration
├── .env.example            # Environment variables template
├── vite.config.js          # Vite configuration
├── tailwind.config.js      # Tailwind CSS configuration
└── package.json
```

---

## 🗄️ Data Model

### Firestore Collections

#### `products`
```javascript
{
  id: string,
  title: string,
  price: number,
  category: string,
  brand: string,
  series: string,
  inStock: boolean,
  stockCount: number,
  images: string[],          // Cloudinary URLs
  shortDescription: string,
  fullSpecs: object,
  highlights: string[],
  tags: string[],
  createdAt: timestamp,
  updatedAt: timestamp,
  createdBy: string          // admin UID
}
```

#### `users`
```javascript
{
  uid: string,
  email: string,
  displayName: string,
  role: 'guest' | 'user' | 'admin',
  photoURL: string,
  createdAt: timestamp,
  lastLogin: timestamp,
  isBlocked: boolean,
  deletionRequested: boolean,
  deletionRequestedAt: timestamp
}
```

#### `reviews`
```javascript
{
  id: string,
  productId: string,
  userId: string,
  userName: string,
  rating: number,            // 1-5
  comment: string,
  createdAt: timestamp,
  verified: boolean,
  helpful: number,
  reported: boolean
}
```

#### `storeMeta`
```javascript
{
  name: string,
  location: object,
  hours: object,
  contact: object,
  social: object,
  theme: string,             // active theme ID
  stats: object              // analytics
}
```

### Realtime Database Structure

```
/chats/
  /{productId}/
    /{messageId}/
      userId: string
      userName: string
      message: string
      timestamp: number
      read: boolean

/typing/
  /{productId}/
    /{userId}: timestamp

/unread/
  /{productId}/
    count: number
```

---

## 🏪 Store Details - Mateen IT Corp

**Name:** Mateen IT Corp.  
**Location:** Maisuma, Srinagar, Kashmir, India - 190001  
**Landmark:** Near Gaw Kadal Bridge  

**Inventory:**
- 10–50 laptops in stock
- 2–6 models at a time
- Bulk order ETA: 6–12 days import + 2–5 days testing

**Hours:**
- Winter: 10:30 AM – 6:00 PM
- Summer: 8:00 AM – 9:00 PM

**Contact:**
- 📞 Phone: [+91 8082754459](tel:+918082754459)
- 💬 WhatsApp: [+91 8082754459](https://wa.me/918082754459)
- 📷 Instagram: [@mitc.usedlaptops](https://www.instagram.com/mitc.usedlaptops)
- 📘 Facebook: [MITC Page](https://www.facebook.com/profile.php?id=100090625847838)
- 📍 Maps: [View Location](https://maps.app.goo.gl/ZwGPFWDgzjKAYcnWA)

---

## 🎨 Theme System

MITC Web App supports 6-8 premium theme presets:

1. **Modern** - Clean, contemporary design
2. **Minimal** - Simplicity-focused
3. **Glass** - Glassmorphism effects
4. **Bold** - High contrast, vibrant
5. **Dark** - Dark mode optimized
6. **Corporate** - Professional business look

Themes control:
- Colors & gradients
- Card styles
- Typography scale
- Animation preferences

---

## 🔐 Security

- Role-based access control (Guest, User, Admin)
- Firestore Security Rules with field validation
- RTDB rules with rate limiting
- Image upload validation
- XSS protection
- Account deletion with optional data purge
- Chat moderation & user blocking

---

## 📱 PWA Features

- ✅ Offline support
- ✅ Service worker caching
- ✅ Add to Home Screen
- ✅ Push notifications (future)
- ✅ Background sync

---

## 🛠️ Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

# Deploy to Firebase
npm run deploy
```

### Environment Variables

See `.env.example` for all required environment variables.

---

## 🚢 Deployment

### Firebase Hosting

```bash
# Build the app
npm run build

# Deploy to Firebase Hosting
firebase deploy --only hosting
```

### Netlify

1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables in Netlify dashboard

---

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

---

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

---

## 📞 Support

For issues or questions:
- Open an issue on GitHub
- Contact: [mateencorp@gmail.com](mailto:mateencorp@gmail.com)
- WhatsApp: [+91 8082754459](https://wa.me/918082754459)

---

**Built with ❤️ for Mateen IT Corp, Srinagar, Kashmir**