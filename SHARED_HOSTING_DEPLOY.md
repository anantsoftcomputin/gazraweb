# Deployment Guide for Shared Hosting

## Building for Production

### 1. Build the Project

```bash
# Navigate to project directory
cd /Users/jigardesai/Desktop/Projects/new-gazra

# Build for production
npm run build
```

This creates a `dist` folder with all production files.

### 2. Upload to Shared Server

#### Files to Upload:
Upload **ALL contents** of the `dist` folder to your web server's public directory (usually `public_html`, `www`, or `htdocs`).

**Contents of `dist` folder:**
```
dist/
├── index.html
├── assets/
│   ├── index-[hash].css
│   └── index-[hash].js
└── [any other static files]
```

#### Using FTP/SFTP:
1. Open your FTP client (FileZilla, Cyberduck, or cPanel File Manager)
2. Connect to your shared hosting
3. Navigate to your public web directory
4. Upload all files from `dist` folder
5. Maintain the folder structure

#### Using cPanel File Manager:
1. Login to cPanel
2. Open File Manager
3. Navigate to `public_html` or `www`
4. Click "Upload"
5. Select all files from `dist` folder
6. Upload and extract if zipped

### 3. Configure Apache (.htaccess)

Create or update `.htaccess` file in your web root for React Router to work:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-l
  RewriteRule . /index.html [L]
</IfModule>

# Cache static assets
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/webp "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
  ExpiresByType application/x-javascript "access plus 1 month"
  ExpiresByType text/javascript "access plus 1 month"
</IfModule>

# Compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html
  AddOutputFilterByType DEFLATE text/css
  AddOutputFilterByType DEFLATE text/javascript
  AddOutputFilterByType DEFLATE application/javascript
  AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>
```

### 4. Verify Deployment

Visit your domain:
- Homepage: `https://yourdomain.com/`
- Admin: `https://yourdomain.com/admin/login`
- Test all routes work correctly

### 5. Update Each Time

When you make changes:

```bash
# 1. Build again
npm run build

# 2. Upload new dist/ contents to server
# (Overwrite old files)

# 3. Clear browser cache
# Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
```

## Important Notes

### Environment Variables
- `.env` file is NOT uploaded to server
- Values are compiled into the build
- Rebuild after changing `.env`

### Public Assets
All files in `/public` folder are included in the build and accessible at root level.

### File Permissions
Set correct permissions on server:
- Directories: 755
- Files: 644

### SSL Certificate
Enable HTTPS through your hosting provider's control panel for security.

## Troubleshooting

### Routes Return 404
- Ensure `.htaccess` is uploaded and configured
- Check if `mod_rewrite` is enabled on server
- Contact hosting support to enable mod_rewrite

### Images Not Loading
- Check file paths in code (should start with `/images/`)
- Verify images are in `public/images/` folder before build
- Ensure correct file names (case-sensitive on Linux servers)

### Blank Page
- Check browser console for errors
- Verify all `dist` files were uploaded
- Check if server supports required Node/JavaScript features

### Admin Portal Not Working
- Verify Firebase configuration in `.env`
- Check Firebase project is active
- Test Firebase connection using browser console

## Quick Deployment Checklist

- [ ] Run `npm run build`
- [ ] Upload all `dist` contents to server
- [ ] Upload `.htaccess` file
- [ ] Test homepage loads
- [ ] Test admin login works
- [ ] Test all navigation routes
- [ ] Test on mobile devices
- [ ] Enable SSL certificate
- [ ] Clear CDN cache (if using one)

## Support

**Technical Issues:**
- Check error console in browser (F12)
- Review server error logs in cPanel
- Contact hosting support for server issues

**Project Contact:**
- Email: info@mcsu.in
- Phone: +91 82003 06871
