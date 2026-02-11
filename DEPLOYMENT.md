# 🚀 SurgiFlow AI - Deployment Guide

## Pre-Deployment Checklist

### ✅ Environment Variables
Ensure all required environment variables are set:

```bash
VITE_GEMINI_API_KEY=your_actual_gemini_api_key
VITE_FIREBASE_VAPID_KEY=your_firebase_vapid_key
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_PROJECT_NUMBER=your_firebase_project_number
```

### ✅ Firebase Configuration
1. **Authentication Providers**
   - Enable Email/Password authentication
   - Enable Google OAuth
   - Enable Facebook OAuth
   - Add authorized domains

2. **Security Rules** (if using Firestore)
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read, write: if request.auth != null;
       }
     }
   }
   ```

3. **App Check** (Recommended for production)
   - Enable reCAPTCHA v3
   - Add your domain to allowed list

---

## Deployment Options

### Option 1: Vercel (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   npm run build
   vercel --prod
   ```

4. **Set Environment Variables**
   - Go to Vercel Dashboard → Project Settings → Environment Variables
   - Add all variables from `.env.local`
   - Redeploy after adding variables

5. **Custom Domain** (Optional)
   - Go to Project Settings → Domains
   - Add your custom domain
   - Update DNS records as instructed

### Option 2: Netlify

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy via Netlify CLI**
   ```bash
   npm install -g netlify-cli
   netlify login
   netlify deploy --prod --dir=dist
   ```

3. **Or use Netlify UI**
   - Drag and drop the `dist` folder to Netlify
   - Configure environment variables in Site Settings

### Option 3: Firebase Hosting

1. **Install Firebase CLI**
   ```bash
   npm install -g firebase-tools
   firebase login
   ```

2. **Initialize Firebase Hosting**
   ```bash
   firebase init hosting
   ```
   - Select your Firebase project
   - Set public directory to `dist`
   - Configure as single-page app: Yes
   - Don't overwrite index.html

3. **Build and Deploy**
   ```bash
   npm run build
   firebase deploy --only hosting
   ```

### Option 4: Docker

1. **Create Dockerfile**
   ```dockerfile
   FROM node:18-alpine AS builder
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci
   COPY . .
   RUN npm run build

   FROM nginx:alpine
   COPY --from=builder /app/dist /usr/share/nginx/html
   COPY nginx.conf /etc/nginx/conf.d/default.conf
   EXPOSE 80
   CMD ["nginx", "-g", "daemon off;"]
   ```

2. **Create nginx.conf**
   ```nginx
   server {
     listen 80;
     server_name _;
     root /usr/share/nginx/html;
     index index.html;

     location / {
       try_files $uri $uri/ /index.html;
     }

     location /api {
       # Proxy to your backend API if needed
     }
   }
   ```

3. **Build and Run**
   ```bash
   docker build -t surgiflow-ai .
   docker run -p 8080:80 surgiflow-ai
   ```

---

## Post-Deployment

### 🔒 Security Hardening

1. **Enable HTTPS**
   - Vercel/Netlify: Automatic
   - Custom server: Use Let's Encrypt

2. **Configure CSP Headers**
   Add to `vercel.json`:
   ```json
   {
     "headers": [
       {
         "source": "/(.*)",
         "headers": [
           {
             "key": "Content-Security-Policy",
             "value": "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://*.googleapis.com https://*.firebase.com wss://*.firebase.com"
           }
         ]
       }
     ]
   }
   ```

3. **Rate Limiting**
   - Implement API rate limiting
   - Use Cloudflare or similar CDN

4. **Monitor API Usage**
   - Set up Google Cloud billing alerts
   - Monitor Gemini API quota
   - Track Firebase usage

### 📊 Analytics Setup

1. **Google Analytics**
   - Add GA4 tracking code to `index.html`
   - Track user interactions

2. **Error Monitoring**
   - Integrate Sentry or similar
   - Monitor production errors

### 🧪 Testing in Production

1. **Smoke Tests**
   - Login functionality
   - Dashboard loads correctly
   - All modules accessible
   - AI features responding

2. **Performance**
   - Run Lighthouse audit
   - Check Core Web Vitals
   - Optimize bundle size if needed

3. **Cross-Browser Testing**
   - Chrome, Firefox, Safari, Edge
   - Mobile browsers (iOS Safari, Chrome Mobile)

---

## Rollback Strategy

### Quick Rollback (Vercel)
```bash
vercel rollback
```

### Manual Rollback
1. Keep previous build artifacts
2. Redeploy from git tag
3. Restore environment variables if changed

---

## Monitoring & Maintenance

### Daily Checks
- [ ] Application uptime
- [ ] Error logs
- [ ] API quota usage

### Weekly Checks
- [ ] Performance metrics
- [ ] User feedback
- [ ] Security updates

### Monthly Checks
- [ ] Dependency updates
- [ ] Backup verification
- [ ] Cost analysis

---

## Troubleshooting

### Build Failures
```bash
# Clear cache and rebuild
rm -rf node_modules dist
npm install
npm run build
```

### Environment Variable Issues
- Ensure all `VITE_` prefixed variables are set
- Restart dev server after changes
- Check Vercel/Netlify dashboard for typos

### Firebase Auth Not Working
- Verify authorized domains in Firebase Console
- Check API keys are correct
- Review browser console for specific errors

---

## Support & Documentation

- **Internal Docs**: Navigate to Docs module in the app
- **Firebase Console**: https://console.firebase.google.com
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Google Cloud Console**: https://console.cloud.google.com

---

**Deployment Checklist**
- [ ] All environment variables configured
- [ ] Firebase authentication enabled
- [ ] Production build tested locally
- [ ] HTTPS enabled
- [ ] Custom domain configured (if applicable)
- [ ] Analytics tracking active
- [ ] Error monitoring setup
- [ ] Backup strategy in place
- [ ] Team notified of deployment
