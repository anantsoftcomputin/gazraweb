# Gazra - LGBTQIA+ Community Platform

A comprehensive web platform for Gazra, an initiative by Shri Maharani Chimnabai Stree Udyogalaya (MCSU) supporting the LGBTQIA+ community in Vadodara, Gujarat.

## 🌟 Features

- **Community Hub**: Information about Gazra's mission, programs, and initiatives
- **Gazra Cafe**: Gujarat's first queer-led cafe with menu and booking
- **Events Management**: Browse and register for community events
- **Volunteer Portal**: Apply to volunteer with various programs
- **Support Fund**: Apply for financial assistance for education, medical care, and legal aid
- **Gazra Skills**: Vocational training programs
- **Gazra Mitra**: Community support platform (redirects to mitra.gazra.org)
- **Admin Portal**: Comprehensive backend for content management

## 🛠️ Tech Stack

- **Frontend**: Next.js 16 + React 19
- **Styling**: Tailwind CSS with custom design system
- **Animation**: Framer Motion
- **Backend**: Firebase (Firestore, Authentication, Storage, Realtime Database, Functions)
- **Routing**: Next.js App Router
- **Icons**: Lucide React, React Icons, Heroicons

## 📋 Prerequisites

- Node.js 22+ and npm
- Firebase account
- Firebase CLI (`npm install -g firebase-tools`)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd new-gazra
```

### 2. Install Dependencies

```bash
npm install --legacy-peer-deps
```

### 3. Environment Setup

Copy `.env.example` to `.env` and update with your Firebase credentials:

```bash
cp .env.example .env
```

The Firebase configuration is already set up in `.env` for the Gazra project.

### 4. Firebase Setup

#### Login to Firebase

```bash
firebase login
```

#### Initialize Firebase (if needed)

```bash
firebase init
```

Select:
- Firestore
- Storage
- Realtime Database
- Functions

#### Deploy Firestore Rules and Indexes

```bash
firebase deploy --only firestore:rules
firebase deploy --only firestore:indexes
firebase deploy --only storage:rules
```

### 5. Create Admin User

In Firebase Console:
1. Go to Authentication > Users
2. Add a user with email and password
3. This user will have admin access to the portal

### 6. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000`

### 7. Build for Production

```bash
npm run build
```

### 8. Frontend Deployment

The frontend is a Next.js app and is intended for Netlify. Firebase remains configured for backend services only.

## 📁 Project Structure

```
new-gazra/
├── src/
│   ├── components/
│   │   ├── home/          # Home page sections
│   │   ├── about/         # About page components
│   │   └── shared/        # Reusable components (Navbar, etc.)
│   ├── views/
│   │   ├── admin/         # Admin portal views
│   │   ├── Home.jsx
│   │   ├── About.jsx
│   │   ├── Events.jsx
│   │   └── ...
│   ├── layouts/
│   │   ├── MainLayout.jsx
│   │   └── AdminLayout.jsx
│   ├── hooks/             # Custom React hooks
│   │   ├── useFirestore.js
│   │   ├── useStorage.js
│   │   └── useAuth.js
│   ├── config/
│   │   └── firebase.js    # Firebase configuration
│   └── ...
├── public/                # Static assets
├── firebase.json          # Firebase configuration
├── firestore.rules        # Firestore security rules
├── storage.rules          # Storage security rules
└── ...
```

## 🔑 Admin Portal

Access the admin portal at `/admin/login`

**Features:**
- Dashboard with statistics
- Events management (Create, Edit, Delete)
- View volunteer applications
- Manage contact messages
- Newsletter subscribers
- Support fund requests
- Menu items management
- Gallery management

**Default Collections:**
- `events` - Community events
- `volunteers` - Volunteer applications
- `contactMessages` - Contact form submissions
- `newsletter` - Newsletter subscribers
- `supportRequests` - Support fund applications
- `menuItems` - Cafe menu items
- `initiatives` - Community initiatives
- `gallery` - Image gallery

## 🔐 Firebase Security

The project includes predefined security rules:

- **Firestore**: Public read for content, authenticated write
- **Storage**: Public read, authenticated write with file size limits
- **Authentication**: Email/password for admin access

## 📱 Responsive Design

Fully responsive design with:
- Mobile-first approach
- Tailwind breakpoints (sm, md, lg, xl)
- Touch-friendly navigation
- Optimized images

## 🎨 Design System

**Colors:**
- Primary: Warm beige (#E6D7B9)
- Secondary: Earthy green (#5C7A64)
- Accents: Terracotta, Sage, Ochre, Slate

**Typography:**
- Display: Cabinet Grotesk
- Body: Inter
- Mono: JetBrains Mono

## 🌐 Deployment

### Frontend

```bash
npm run build
```

The frontend is a Next.js app intended for Netlify. Netlify supports modern Next.js apps through its OpenNext adapter, including App Router and SSR. Do not deploy the frontend through Firebase Hosting or shared hosting.

### Firebase Backend

Firebase remains responsible for Authentication, Firestore, Storage, Realtime Database, and Functions.

## 📧 Contact

- **Email**: info@mcsu.in
- **Phone**: +91 82003 06871
- **Location**: Gazra Cafe, Opp. Sursagar, Mandvi, Vadodara

## 📄 License

© 2025 Shri Maharani Chimnabai Stree Udyogalaya. All rights reserved.

## 🤝 Contributing

This is a private project for Gazra. For contributions, please contact the administrators.

## 🙏 Acknowledgments

- MCSU Team
- Gazra Community
- Vadodara Royal Family for their support
