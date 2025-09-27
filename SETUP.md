# Quick Setup Guide 🚀

Follow these steps to get your ETF Dashboard running in minutes!

## 1. Install Dependencies

```bash
npm install
```

## 2. Firebase Setup (Required for Authentication)

### Option A: Use Demo Mode (Skip Firebase for now)
You can run the app without Firebase by using mock authentication. The app will work with limited functionality.

### Option B: Set up Firebase (Recommended)

1. **Create Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Click "Create a project"
   - Follow the setup wizard

2. **Enable Authentication**
   - In Firebase Console, go to "Authentication"
   - Click "Get started"
   - Go to "Sign-in method" tab
   - Enable "Google" provider
   - Add your domain (localhost:3000 for development)

3. **Get Configuration**
   - Go to Project Settings (gear icon)
   - Scroll down to "Your apps"
   - Click "Add app" → Web app
   - Copy the configuration object

4. **Set Environment Variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` file with your Firebase config:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key_here
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
   VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
   ```

## 3. Start Development Server

```bash
npm run dev
```

The app will open at `http://localhost:3000`

## 4. Test the Application

### Without Firebase (Demo Mode)
- The app will show a basic login form
- You can explore the UI with mock data
- Authentication features will be limited

### With Firebase
- Click "Sign in with Google"
- Complete the OAuth flow
- Access full dashboard functionality

## 5. Explore Features

### Dashboard
- View ETF cards with real-time data simulation
- Search and filter ETFs
- Click on ETF cards to see detailed charts
- Toggle between dark/light themes

### Portfolio
- View portfolio allocation
- Track holdings and performance
- See upcoming dividends
- Manage transactions

## 6. Development Tips

### Hot Reload
The development server supports hot reload. Changes to your code will automatically refresh the browser.

### Dark Mode
The app automatically detects your system theme preference and can be toggled manually.

### Responsive Design
Test the app on different screen sizes - it's fully responsive.

## 7. Build for Production

```bash
npm run build
```

This creates a `dist` folder with optimized production files.

## 8. Common Issues

### Firebase Errors
- **"Firebase config not found"**: Check your `.env` file
- **"Domain not authorized"**: Add your domain in Firebase Console
- **"Google sign-in failed"**: Verify Google provider is enabled

### Build Errors
- **"Module not found"**: Run `npm install` again
- **"Vite build failed"**: Check for TypeScript errors in console

### Styling Issues
- **"Styles not loading"**: Ensure TailwindCSS is properly configured
- **"Dark mode not working"**: Check if `dark` class is added to `<html>`

## 9. Next Steps

1. **Customize the Design**
   - Modify colors in `tailwind.config.js`
   - Update components in `src/components/`

2. **Add Real Data**
   - Integrate with financial APIs (Polygon.io, Alpha Vantage)
   - Replace mock data in `src/data/mockData.js`

3. **Deploy**
   - Use Netlify, Vercel, or your preferred hosting platform
   - Set environment variables in your hosting dashboard

## 🎉 You're Ready!

Your ETF Dashboard is now running! Start exploring the features and customizing it to your needs.

For more detailed information, check the main [README.md](README.md) file.
