# Firebase Deployment Guide for Gazra Website

## Overview
This guide covers the complete setup and deployment process for the Gazra website using Firebase.

## Prerequisites Checklist
- [x] Firebase account created
- [x] Firebase project: `gazraweb-33d32`
- [x] Firebase CLI installed: `npm install -g firebase-tools`
- [x] Node.js 16+ installed
- [x] Git repository set up

## Step 1: Initial Setup (Already Complete)

### Firebase Project Configuration
```
Project ID: gazraweb-33d32
Auth Domain: gazraweb-33d32.firebaseapp.com
Database URL: https://gazraweb-33d32-default-rtdb.firebaseio.com
Storage Bucket: gs://gazraweb-33d32.firebasestorage.app
```

### Services Enabled
- ✅ Firestore Database
- ✅ Realtime Database
- ✅ Firebase Storage
- ✅ Firebase Hosting
- ✅ Firebase Authentication
- ✅ Firebase Analytics

## Step 2: Environment Configuration

### Local Development
1. The `.env` file is already configured with Firebase credentials
2. Keep `.env` in `.gitignore` (already configured)
3. Share `.env.example` with team members

### Production Environment Variables
Firebase Hosting automatically uses the `.env` file during build.

## Step 3: Firebase CLI Setup

### Login to Firebase
```bash
firebase login
```

### Verify Project Connection
```bash
firebase projects:list
firebase use gazraweb-33d32
```

## Step 4: Firestore Database Setup

### Deploy Security Rules
```bash
firebase deploy --only firestore:rules
```

### Deploy Indexes
```bash
firebase deploy --only firestore:indexes
```

### Create Initial Collections (via Firebase Console or code)

**Collections to create:**
1. `events` - Community events
2. `volunteers` - Volunteer applications
3. `contactMessages` - Contact form submissions
4. `newsletter` - Email subscribers
5. `supportRequests` - Support fund applications
6. `menuItems` - Cafe menu items
7. `initiatives` - Program initiatives
8. `gallery` - Photo gallery

## Step 5: Firebase Storage Setup

### Deploy Storage Rules
```bash
firebase deploy --only storage:rules
```

### Create Folder Structure
In Firebase Console > Storage, create folders:
- `/events` - Event images
- `/gallery` - Gallery images
- `/menu` - Menu item images
- `/initiatives` - Initiative images

## Step 6: Firebase Authentication Setup

### Enable Email/Password Authentication
1. Go to Firebase Console > Authentication
2. Click "Get Started"
3. Enable "Email/Password" provider
4. Save

### Create Admin User
1. Go to Authentication > Users
2. Click "Add User"
3. Enter admin email and password
4. Save credentials securely
5. This user will access `/admin/login`

**Recommended Admin Emails:**
- admin@gazra.org
- info@mcsu.in

## Step 7: Build and Deploy

### First Time Deployment

1. **Install Dependencies**
```bash
npm install --legacy-peer-deps
```

2. **Test Locally**
```bash
npm run dev
```
Visit http://localhost:5173 and test all pages

3. **Build for Production**
```bash
npm run build
```
This creates a `dist` folder

4. **Deploy to Firebase Hosting**
```bash
firebase deploy --only hosting
```

### Subsequent Deployments
```bash
npm run build && firebase deploy --only hosting
```

## Step 8: Post-Deployment Checklist

### Verify Deployment
- [ ] Visit: https://gazraweb-33d32.web.app
- [ ] Visit: https://gazraweb-33d32.firebaseapp.com
- [ ] Test all public pages load correctly
- [ ] Test admin login at `/admin/login`
- [ ] Verify responsive design on mobile
- [ ] Check all images load
- [ ] Test form submissions

### Test Admin Portal
1. Go to https://gazraweb-33d32.web.app/admin/login
2. Login with admin credentials
3. Test dashboard loads
4. Create a test event
5. Upload an image
6. Verify data appears in Firestore
7. Delete test data

### Configure Custom Domain (Optional)
1. Go to Firebase Console > Hosting
2. Click "Add custom domain"
3. Enter: gazra.org or www.gazra.org
4. Follow DNS configuration steps
5. Wait for SSL certificate provisioning (up to 24 hours)

## Step 9: Monitoring and Analytics

### Enable Firebase Analytics
Already configured in `firebase.js`

### Monitor Usage
1. Firebase Console > Analytics > Dashboard
2. View page views, user engagement
3. Track events and conversions

### Monitor Errors
1. Install Firebase Crashlytics (optional)
2. Check Firebase Console > Quality > Crashlytics

## Step 10: Maintenance

### Update Content
Use Admin Portal at `/admin/login` to:
- Add/edit events
- Manage volunteer applications
- Review contact messages
- Add menu items
- Upload gallery images

### Update Code
```bash
git pull origin main
npm install --legacy-peer-deps
npm run build
firebase deploy --only hosting
```

### Backup Database
Firebase automatically backs up Firestore data.

Manual export:
```bash
gcloud firestore export gs://gazraweb-33d32.appspot.com/backups
```

## Troubleshooting

### Issue: Build fails
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
npm run build
```

### Issue: Firebase deploy fails
```bash
# Re-authenticate
firebase login --reauth
firebase use gazraweb-33d32
firebase deploy
```

### Issue: 404 on refresh
Already fixed with rewrites in `firebase.json`. If issue persists:
```json
"rewrites": [
  {
    "source": "**",
    "destination": "/index.html"
  }
]
```

### Issue: Environment variables not working
- Ensure `.env` exists in root
- Variables must start with `VITE_`
- Rebuild: `npm run build`

### Issue: Firebase quota exceeded
- Check Firebase Console > Usage
- Upgrade to Blaze plan if needed
- Optimize image sizes
- Enable caching headers (already in firebase.json)

## Security Best Practices

### Firestore Rules
- ✅ Public read for content
- ✅ Authenticated write for admin
- ✅ User-created documents for forms

### Storage Rules
- ✅ Public read for images
- ✅ Authenticated write
- ✅ File size limits (5MB)
- ✅ Content type validation

### Authentication
- ✅ Email/password only for admin
- ✅ No public sign-up
- ✅ Secure password requirements

## Performance Optimization

### Already Implemented
- ✅ Vite for fast builds
- ✅ Code splitting with React Router
- ✅ Image optimization in Tailwind
- ✅ Lazy loading for images
- ✅ CDN via Firebase Hosting
- ✅ Cache headers for static assets

### Additional Optimizations
1. Compress images before upload
2. Use WebP format for images
3. Enable Firebase Performance Monitoring
4. Use Firebase CDN for images

## Cost Estimation (Firebase Free Tier)

**Spark Plan (Free):**
- Hosting: 10GB storage, 360MB/day transfer
- Firestore: 1GB storage, 50K reads, 20K writes/day
- Storage: 5GB storage, 1GB/day transfer
- Authentication: Unlimited

**Expected Usage:**
- Small to medium traffic: Free tier sufficient
- High traffic: Consider Blaze (pay-as-you-go)

## Support Contacts

**Technical Issues:**
- Firebase Support: https://firebase.google.com/support
- Developer: Check your team contact

**Project Contact:**
- Email: info@mcsu.in
- Phone: +91 82003 06871

## Quick Commands Reference

```bash
# Login
firebase login

# Deploy everything
firebase deploy

# Deploy specific services
firebase deploy --only hosting
firebase deploy --only firestore:rules
firebase deploy --only storage:rules

# View logs
firebase hosting:channel:deploy preview

# Local testing
npm run dev
npm run build
firebase serve

# Check project status
firebase projects:list
firebase use
```

## Next Steps

1. ✅ Complete deployment
2. ⬜ Train admin users on portal
3. ⬜ Add initial content (events, menu items)
4. ⬜ Test all features end-to-end
5. ⬜ Configure custom domain
6. ⬜ Set up analytics tracking
7. ⬜ Create content upload schedule
8. ⬜ Plan social media integration

---

**Last Updated:** November 26, 2025
**Project:** Gazra Website
**Firebase Project:** gazraweb-33d32
