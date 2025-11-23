# MITC Web App - System Architecture

This document describes the technical architecture of the MITC Web App.

## Overview

MITC Web App is a modern, production-ready showroom application built with:
- **Frontend**: React 18 + Vite + Tailwind CSS
- **Backend**: Firebase (Authentication, Firestore, Realtime Database, Cloud Functions)
- **Image Hosting**: Cloudinary
- **Deployment**: Firebase Hosting / Netlify / Vercel

## Architecture Diagram

```
┌─────────────────────────────────────┐
│         Client (React PWA)             │
│  ┌──────────────────────────────┐ │
│  │ Components & Pages          │ │
│  │ - Home, Product Detail      │ │
│  │ - Admin Dashboard           │ │
│  │ - Chat, Reviews             │ │
│  └──────────────────────────────┘ │
│  ┌──────────────────────────────┐ │
│  │ React Contexts              │ │
│  │ - AuthContext               │ │
│  │ - ThemeContext              │ │
│  │ - ChatContext               │ │
│  └──────────────────────────────┘ │
│  ┌──────────────────────────────┐ │
│  │ Services                    │ │
│  │ - productService            │ │
│  │ - reviewService             │ │
│  │ - userService               │ │
│  └──────────────────────────────┘ │
└─────────────────────────────────────┘
           │              │
           │              │
           │              │
┌──────────┴──────────────┴──────────┐
│      Firebase Services          │
│  ┌──────────────────────────┐ │
│  │ Authentication            │ │
│  │ - Email/Password          │ │
│  │ - Google OAuth            │ │
│  └──────────────────────────┘ │
│  ┌──────────────────────────┐ │
│  │ Firestore Database        │ │
│  │ - products                │ │
│  │ - users                   │ │
│  │ - reviews                 │ │
│  │ - storeMeta               │ │
│  └──────────────────────────┘ │
│  ┌──────────────────────────┐ │
│  │ Realtime Database (RTDB) │ │
│  │ - /chats                  │ │
│  │ - /typing                 │ │
│  │ - /unread                 │ │
│  │ - /presence               │ │
│  └──────────────────────────┘ │
│  ┌──────────────────────────┐ │
│  │ Cloud Functions           │ │
│  │ - Image Processing        │ │
│  │ - Cleanup Jobs            │ │
│  │ - Analytics               │ │
│  └──────────────────────────┘ │
└──────────────────────────────────┘
           │
           │
┌──────────┴──────────┐
│    Cloudinary         │
│  Image Hosting      │
│  & Optimization     │
└─────────────────────┘
```

## Component Architecture

### Frontend Structure

```
src/
├── components/
│   ├── common/          # Shared components
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   ├── Layout.jsx
│   │   ├── Button.jsx
│   │   ├── Card.jsx
│   │   └── Loading.jsx
│   ├── products/        # Product components
│   │   ├── ProductCard.jsx
│   │   ├── ProductGrid.jsx
│   │   ├── ProductFilter.jsx
│   │   └── ImageGallery.jsx
│   ├── chat/            # Chat components
│   │   ├── ChatWidget.jsx
│   │   ├── ChatMessage.jsx
│   │   └── TypingIndicator.jsx
│   ├── reviews/         # Review components
│   │   ├── ReviewCard.jsx
│   │   ├── ReviewForm.jsx
│   │   └── StarRating.jsx
│   ├── auth/            # Auth components
│   │   ├── ProtectedRoute.jsx
│   │   └── AdminRoute.jsx
│   └── admin/           # Admin components
│       ├── AdminLayout.jsx
│       ├── ProductTable.jsx
│       └── ImageUploader.jsx
└── pages/
    ├── Home.jsx
    ├── ProductDetail.jsx
    ├── StoreInfo.jsx
    ├── auth/
    │   ├── Login.jsx
    │   ├── Register.jsx
    │   └── Profile.jsx
    └── admin/
        ├── Dashboard.jsx
        ├── ProductManagement.jsx
        ├── ProductEditor.jsx
        ├── ChatModeration.jsx
        ├── UserManagement.jsx
        ├── ReviewModeration.jsx
        ├── ImportExport.jsx
        └── Settings.jsx
```

## Data Flow

### Authentication Flow

```
User Action → AuthContext → Firebase Auth → Firestore User Doc
                   │
                   ↓
            Update currentUser state
                   │
                   ↓
            Re-render protected routes
```

### Product Management Flow

```
Admin creates product
    ↓
1. Validate data (utils/validation.js)
    ↓
2. Compress images (utils/imageCompression.js)
    ↓
3. Upload to Cloudinary (config/cloudinary.js)
    ↓
4. Save to Firestore (services/productService.js)
    ↓
5. Trigger Cloud Function (analytics update)
    ↓
6. Update UI
```

### Live Chat Flow

```
User sends message
    ↓
ChatContext.sendMessage()
    ↓
Firebase RTDB push()
    ↓
Realtime listener updates
    ↓
Re-render chat UI
    ↓
Typing indicators sync
```

## State Management

### React Contexts

1. **AuthContext**
   - Current user state
   - User data from Firestore
   - Auth methods (signIn, signUp, signOut)
   - Account deletion

2. **ThemeContext**
   - Active theme
   - Dark mode toggle
   - Theme switching

3. **ChatContext**
   - Active chats
   - Unread counts
   - Chat methods (send, markAsRead)
   - Typing indicators

## Security Architecture

### Role-Based Access Control (RBAC)

```
Roles:
- guest: Browse products, view store info
- user: All guest permissions + submit reviews, use chat
- admin: All user permissions + manage products, users, reviews
```

### Firestore Security Rules

- Products: Public read, admin-only write
- Users: Self-read, admin-read-all, self-update (limited)
- Reviews: Public read, authenticated write (own reviews)
- Admin collections: Admin-only access

### RTDB Security Rules

- Chat: Public read, authenticated write (own messages)
- Typing indicators: Authenticated write (own status)
- Rate limiting via timestamp validation

## Image Processing Pipeline

```
1. Client-side:
   - File validation
   - Browser compression (browser-image-compression)
   - Max 700KB target
   ↓
2. Upload to Cloudinary:
   - Automatic optimization
   - CDN distribution
   - Generate thumbnails
   ↓
3. Fallback (Cloud Function):
   - Server-side compression if needed
   - Sharp library processing
```

## Performance Optimizations

### Frontend

- Code splitting (React.lazy)
- Image lazy loading
- Virtual scrolling for large lists
- Debounced search
- Memoization (useMemo, useCallback)

### Backend

- Firestore indexes for complex queries
- Pagination for data fetching
- RTDB structure optimized for reads
- Cloud Function caching

### PWA

- Service worker caching
- Offline fallbacks
- Background sync
- Asset preloading

## Scalability Considerations

### Current Capacity

- **Products**: Unlimited (Firestore scales automatically)
- **Users**: Unlimited
- **Chat messages**: Limited by RTDB (cleanup after 30 days)
- **Images**: Unlimited (Cloudinary)

### Scaling Strategies

1. **Horizontal Scaling**
   - Firebase auto-scales
   - Add more Cloud Function instances
   - CDN for static assets

2. **Database Optimization**
   - Compound indexes
   - Denormalization where needed
   - Pagination
   - Archival of old data

3. **Caching**
   - Browser caching (service worker)
   - CDN caching (Cloudinary, Firebase Hosting)
   - Application-level caching (React Query)

## Monitoring & Analytics

### Firebase Performance Monitoring

- Page load times
- Network requests
- Function execution times

### Custom Analytics

- Product views
- Search queries
- User actions
- Admin activities

### Error Tracking

- Console errors
- Function failures
- Security rule violations

## Backup & Recovery

### Firestore Backups

```bash
# Schedule daily backups
gcloud firestore export gs://backup-bucket
```

### RTDB Backups

- Automatic backups enabled
- Point-in-time recovery

### Code Backups

- GitHub repository
- Version control
- Release tags

## Future Enhancements

### Phase 2

- Push notifications
- Advanced search (Algolia)
- Email notifications
- Wishlist feature

### Phase 3

- React Native mobile app
- Multi-language support
- Payment gateway
- Advanced analytics dashboard

### Phase 4

- AI-powered recommendations
- Chatbot integration
- Voice search
- AR product preview

---

## Technical Decisions

### Why Firebase?

- Real-time capabilities (chat, typing indicators)
- Built-in authentication
- Scalable infrastructure
- Free tier sufficient for MVP
- Easy integration

### Why Cloudinary?

- Automatic image optimization
- CDN distribution
- Transformation capabilities
- Free tier generous
- Easy API

### Why Vite?

- Fast development server
- Optimized production builds
- Modern tooling
- Better than CRA performance
- Native ES modules

### Why Tailwind CSS?

- Utility-first approach
- Small bundle size
- Easy customization
- Dark mode support
- Responsive design

---

For implementation details, see individual service files and component documentation.
