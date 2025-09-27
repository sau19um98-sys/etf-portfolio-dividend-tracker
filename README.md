# ETF Dividend Tracker 📈

A production-ready ETF dividend tracking application optimized for the **Polygon.io Stocks Starter Plan**, featuring comprehensive portfolio management, dividend calculations, and delayed market data integration.

![ETF Dashboard](https://img.shields.io/badge/React-18.2.0-blue)
![Vite](https://img.shields.io/badge/Vite-5.0.8-green)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.3.6-blue)
![Appwrite](https://img.shields.io/badge/Appwrite-13.0.0-red)
![Polygon.io](https://img.shields.io/badge/Polygon.io-Starter-green)

## ✨ Features

### 🎨 Modern UI/UX
- **Dark/Light Mode Toggle** - Seamless theme switching with system preference detection
- **Glassmorphism Design** - Modern, translucent UI elements with backdrop blur effects
- **Responsive Layout** - Optimized for desktop, tablet, and mobile devices
- **Smooth Animations** - Framer Motion powered transitions and micro-interactions

### 📊 ETF Tracking (Polygon.io Starter Plan)
- **Delayed Price Data** - 15-minute delayed ETF prices with clear indicators
- **End-of-Day Updates** - Previous day closing prices and changes
- **Dividend Management** - Historical dividend data and future projections
- **Smart Rate Limiting** - Optimized for 5 API calls per minute limit
- **Search & Filter** - Find ETFs by symbol or name with sector filtering

### 💼 Portfolio Management
- **Holdings Overview** - Comprehensive portfolio allocation and performance metrics
- **Dividend Calendar** - Upcoming dividend payments and historical tracking
- **Performance Analytics** - Gain/loss tracking with percentage calculations
- **Transaction History** - Complete record of buys, sells, and dividend payments

### 🔐 Authentication System
- **Demo Mode** - Currently running in demo mode for development/testing
- **Email/Password Ready** - Complete UI for email-based authentication
- **Google OAuth Ready** - Google login button and flow implemented
- **Appwrite Integration** - Backend service configured for production auth
- **Protected Routes** - Secure access to portfolio data
- **User Profiles** - Personalized dashboard experience

### 📱 Additional Features
- **Data Freshness Indicators** - Clear timestamps and delayed data warnings
- **24-Hour Refresh Limits** - Smart API quota management
- **Error Boundaries** - Graceful error handling and recovery
- **Production Notifications** - Toast notifications for user feedback
- **Plan Limitation Banners** - Transparent communication about data limitations

## 🚀 Technology Stack

### Frontend
- **React 18** - Latest React with concurrent features
- **Vite** - Lightning-fast build tool and dev server
- **TailwindCSS** - Utility-first CSS framework
- **Chart.js** - Interactive charts and data visualization
- **React Router** - Client-side routing
- **React Icons** - Comprehensive icon library

### Backend & Services
- **Appwrite** - Backend-as-a-Service for authentication and database
- **Polygon.io Starter Plan** - Market data API with 15-minute delays
- **Smart Caching** - 15-minute cache to optimize API usage
- **Rate Limiting** - Built-in 5 calls/minute enforcement

### Development Tools
- **ESLint** - Code linting and formatting
- **PostCSS** - CSS processing and optimization
- **Autoprefixer** - Automatic vendor prefixing

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/etf-dashboard.git
   cd etf-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your configuration:
   ```env
   # Polygon.io API (Starter Plan)
   VITE_POLYGON_API_KEY=your_polygon_api_key
   
   # Appwrite Configuration
   VITE_APPWRITE_ENDPOINT=https://your-appwrite-endpoint.com/v1
   VITE_APPWRITE_PROJECT_ID=your_project_id
   VITE_APPWRITE_DATABASE_ID=your_database_id
   VITE_APPWRITE_COLLECTION_ETFS=your_etfs_collection_id
   VITE_APPWRITE_COLLECTION_PORTFOLIOS=your_portfolios_collection_id
   VITE_APPWRITE_COLLECTION_TRANSACTIONS=your_transactions_collection_id
   VITE_APPWRITE_COLLECTION_DIVIDENDS=your_dividends_collection_id
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 💰 Production Cost Breakdown

### Monthly Costs (Optimized for Polygon.io Starter Plan)

| Service | Plan | Monthly Cost | Purpose |
|---------|------|-------------|---------|
| **Hostinger VPS** | VPS 3 | $15.99 | Application hosting |
| **Polygon.io** | Stocks Starter | ~$99.00 | Market data API |
| **Appwrite Cloud** | Pro | $15.00 | Backend services |
| **Domain + SSL** | Annual | ~$1.08 | Domain and security |
| **Total** | | **~$131/month** | Complete production setup |

### What You Get:
- ✅ **Professional ETF tracking** with delayed market data
- ✅ **Complete portfolio management** with transaction history
- ✅ **Dividend calculations** and upcoming payment tracking
- ✅ **User authentication** and secure data storage
- ✅ **Production-ready deployment** on VPS with SSL

### Cost Comparison:
- **Previous estimate**: ~$215/month (with Developer plan)
- **Optimized setup**: ~$131/month (with Starter plan)
- **Savings**: ~$84/month (~$1,008/year)

## 🔧 Configuration

### Polygon.io Setup (Starter Plan)

1. **Subscribe to Polygon.io**
   - Go to [polygon.io/pricing](https://polygon.io/pricing)
   - Subscribe to **Stocks Starter Plan** (~$99/month)
   - Get your API key from the dashboard

2. **Test API Access**
   ```bash
   curl "https://api.polygon.io/v2/aggs/ticker/SPY/prev?apikey=YOUR_API_KEY"
   ```

### Appwrite Setup

1. **Create Appwrite Project**
   - Set up Appwrite on your Hostinger VPS or use Appwrite Cloud
   - Create a new project
   - Set up authentication and database

2. **Create Database Collections**
   - `etfs` - ETF master data
   - `portfolios` - User portfolio holdings
   - `transactions` - Transaction history
   - `dividends` - Dividend payment records

3. **Configure Authentication**
   - Enable Email/Password authentication
   - Set up Google OAuth (optional)
   - Configure session settings and security

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_POLYGON_API_KEY` | Polygon.io API key (Starter plan) | Yes |
| `VITE_APPWRITE_ENDPOINT` | Appwrite server endpoint | Yes |
| `VITE_APPWRITE_PROJECT_ID` | Appwrite project ID | Yes |
| `VITE_APPWRITE_DATABASE_ID` | Appwrite database ID | Yes |
| `VITE_APPWRITE_COLLECTION_*` | Collection IDs for each data type | Yes |

## 🏗️ Project Structure

```
etf-dashboard/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── common/         # Common components (Header, ThemeToggle)
│   │   ├── etf/           # ETF-specific components
│   │   └── portfolio/      # Portfolio components
│   ├── context/           # React context providers
│   │   ├── AuthContext.jsx
│   │   └── ThemeContext.jsx
│   ├── data/              # Mock data and utilities
│   │   └── mockData.js
│   ├── firebase/          # Firebase configuration
│   │   └── config.js
│   ├── pages/             # Page components
│   │   ├── Dashboard.jsx
│   │   ├── Login.jsx
│   │   └── Portfolio.jsx
│   ├── styles/            # Global styles
│   │   └── globals.css
│   ├── App.jsx            # Main app component
│   └── main.jsx           # Entry point
├── .env.example           # Environment variables template
├── package.json           # Dependencies and scripts
├── tailwind.config.js     # Tailwind configuration
├── vite.config.js         # Vite configuration
└── README.md              # This file
```

## 📊 Mock Data

The application includes comprehensive mock data for development:

### ETFs Included
- **Large Cap**: SPY, VTI, QQQ
- **Dividend Focus**: SCHD, VYM
- **Income**: JEPI, QYLD
- **Sector**: XLF (Financial), XLK (Technology)
- **International**: VXUS

### Data Features
- Historical price data (30 days)
- Dividend payment history
- Ex-dividend dates and payment schedules
- Sector classifications
- Expense ratios and AUM data

## 🎨 Customization

### Theme Customization

The app uses TailwindCSS with custom color schemes. Modify `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        // Your custom primary colors
      }
    }
  }
}
```

### Component Styling

All components use Tailwind classes with dark mode support:

```jsx
className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
```

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Netlify

1. Build the project
2. Deploy the `dist` folder to Netlify
3. Set environment variables in Netlify dashboard

### Deploy to Vercel

1. Connect your GitHub repository
2. Set environment variables
3. Deploy automatically on push

## 🔮 Future Enhancements

### Planned Features
- [ ] Real-time API integration (Polygon.io, Alpha Vantage)
- [ ] Advanced portfolio analytics
- [ ] Dividend reinvestment tracking
- [ ] Tax reporting features
- [ ] Mobile app (React Native)
- [ ] Email notifications
- [ ] Social features (share portfolios)
- [ ] Advanced charting (candlestick, technical indicators)

### Polygon.io Starter Plan Integration ✅
The application is fully optimized for the Polygon.io Stocks Starter Plan:

#### ✅ **What Works:**
- **ETF Price Data** - Previous day closing prices with 15-minute delays
- **Dividend Information** - Historical dividend payments and schedules
- **Portfolio Tracking** - Complete portfolio management with transaction history
- **Search & Filter** - Find ETFs by symbol or name
- **Rate Limiting** - Smart 5 calls/minute management with caching

#### ⚠️ **Limitations (Handled Gracefully):**
- **No Real-time Data** - Prices delayed by ~15 minutes (clearly indicated)
- **No Intraday Charts** - Only end-of-day price points
- **24-Hour Refresh Limit** - Prevents API quota exhaustion
- **No Financial Ratios** - P/E, debt ratios not available on Starter plan

#### 🛡️ **User Experience:**
- **Clear Indicators** - "Delayed" badges on all price data
- **Data Freshness** - Timestamps showing when data was last updated
- **Plan Limitations** - Transparent banners explaining current restrictions
- **Smart Caching** - 15-minute cache reduces API calls
- **Error Handling** - Graceful fallbacks for failed requests

📖 **See [POLYGON_STARTER_GUIDE.md](POLYGON_STARTER_GUIDE.md) for detailed integration guide.**

## 🔐 Authentication Setup

### Current Status: Demo Mode

The application currently runs in **demo mode** for development and testing purposes. All authentication flows are implemented and ready for production deployment with Appwrite.

### 🎯 Authentication Features

#### ✅ **Implemented & Ready:**
- **Email/Password Registration** - Complete signup form with validation
- **Email/Password Login** - Secure login with error handling
- **Google OAuth Integration** - One-click Google authentication
- **Protected Routes** - Automatic redirection for unauthenticated users
- **Session Management** - Persistent login state with localStorage
- **User Profile Management** - Display name and email handling
- **Logout Functionality** - Secure session termination

#### 🔧 **Demo Mode Features:**
- **Instant Login** - No real authentication required for testing
- **Persistent Sessions** - Login state saved in localStorage
- **Form Validation** - All validation logic working
- **Error Handling** - Complete error states and messaging
- **Loading States** - Proper loading indicators during auth

### 🚀 **Production Authentication Setup**

#### **Step 1: Appwrite Configuration**

1. **Enable Authentication Methods**
   ```bash
   # In Appwrite Console → Auth → Settings
   ✅ Email/Password Authentication
   ✅ Google OAuth (optional)
   ```

2. **Configure OAuth (Google)**
   ```bash
   # Google Cloud Console Setup:
   - Create OAuth 2.0 Client ID
   - Add authorized origins: https://yourdomain.com
   - Add redirect URIs: https://your-appwrite-endpoint/v1/account/sessions/oauth2/callback/google
   
   # Appwrite Console → Auth → OAuth2:
   - Provider: Google
   - App ID: [Your Google Client ID]
   - App Secret: [Your Google Client Secret]
   ```

#### **Step 2: Update AuthContext for Production**

Replace the demo AuthContext with real Appwrite integration:

```javascript
// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { account } from '../config/appwrite';

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Real Appwrite authentication
  const signup = async (email, password, displayName) => {
    try {
      setError(null);
      setLoading(true);
      
      // Create account
      const user = await account.create('unique()', email, password, displayName);
      
      // Create session
      await account.createEmailSession(email, password);
      
      // Get user data
      const userData = await account.get();
      setCurrentUser(userData);
      
      return { user: userData };
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setError(null);
      setLoading(true);
      
      // Create session
      await account.createEmailSession(email, password);
      
      // Get user data
      const userData = await account.get();
      setCurrentUser(userData);
      
      return { user: userData };
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    try {
      setError(null);
      setLoading(true);
      
      // Redirect to Google OAuth
      account.createOAuth2Session(
        'google',
        'https://yourdomain.com/dashboard', // success URL
        'https://yourdomain.com/login?error=oauth' // failure URL
      );
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setError(null);
      await account.deleteSession('current');
      setCurrentUser(null);
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userData = await account.get();
        setCurrentUser(userData);
      } catch (error) {
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  const value = {
    currentUser,
    loading,
    error,
    signup,
    login,
    loginWithGoogle,
    logout,
    clearError: () => setError(null)
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
```

#### **Step 3: Appwrite Client Configuration**

```javascript
// src/config/appwrite.js
import { Client, Account, Databases } from 'appwrite';

const client = new Client()
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

export const account = new Account(client);
export const databases = new Databases(client);
export { client };
```

#### **Step 4: Environment Variables**

```env
# Appwrite Configuration
VITE_APPWRITE_ENDPOINT=https://your-vps-ip:8080/v1
VITE_APPWRITE_PROJECT_ID=your-project-id
VITE_APPWRITE_DATABASE_ID=your-database-id

# Collection IDs
VITE_APPWRITE_COLLECTION_ETFS=etfs-collection-id
VITE_APPWRITE_COLLECTION_PORTFOLIOS=portfolios-collection-id
VITE_APPWRITE_COLLECTION_TRANSACTIONS=transactions-collection-id
VITE_APPWRITE_COLLECTION_DIVIDENDS=dividends-collection-id

# Google OAuth (if using)
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

### 🔒 **Security Features**

#### **Authentication Security:**
- **JWT Tokens** - Secure session management with Appwrite
- **HTTPS Required** - All authentication requires SSL/TLS
- **Session Expiration** - Automatic logout after inactivity
- **CORS Protection** - Proper cross-origin request handling
- **Input Validation** - Client and server-side validation

#### **Data Protection:**
- **Protected Routes** - Authentication required for sensitive pages
- **User Isolation** - Each user only sees their own data
- **API Key Security** - Environment variables for sensitive data
- **Error Handling** - No sensitive information in error messages

### 🎨 **Authentication UI**

#### **Login Page Features:**
- **Responsive Design** - Works on all device sizes
- **Dark/Light Mode** - Theme-aware authentication forms
- **Form Validation** - Real-time validation with error messages
- **Loading States** - Visual feedback during authentication
- **Password Visibility** - Toggle password visibility
- **Social Login** - Google OAuth integration
- **Registration Toggle** - Switch between login and signup

#### **User Experience:**
- **Auto-redirect** - Automatic navigation after successful auth
- **Error Messages** - Clear, user-friendly error communication
- **Remember Me** - Persistent sessions across browser sessions
- **Forgot Password** - Password reset functionality (when implemented)

### 📱 **Mobile Authentication**

The authentication system is fully responsive and optimized for mobile devices:

- **Touch-friendly** - Large buttons and input fields
- **Mobile keyboards** - Proper input types for email/password
- **Gesture support** - Swipe and touch interactions
- **Fast loading** - Optimized for mobile networks

### 🔄 **Migration from Demo to Production**

To switch from demo mode to production authentication:

1. **Replace AuthContext** - Update with real Appwrite calls
2. **Configure Appwrite** - Set up authentication methods
3. **Update environment** - Add production API keys
4. **Test thoroughly** - Verify all authentication flows
5. **Deploy securely** - Ensure HTTPS and proper CORS

### 🛠️ **Troubleshooting Authentication**

#### **Common Issues:**
- **CORS Errors** - Check Appwrite CORS settings
- **OAuth Redirect** - Verify redirect URLs in Google Console
- **Session Persistence** - Check localStorage and cookies
- **API Keys** - Ensure environment variables are set correctly

#### **Debug Mode:**
```javascript
// Enable debug logging
console.log('Auth State:', { currentUser, loading, error });
```

**🎯 The authentication system is production-ready and just needs Appwrite configuration to go live!**

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### Code Style

- Use ESLint configuration
- Follow React best practices
- Write meaningful commit messages
- Add comments for complex logic

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - UI library
- [Vite](https://vitejs.dev/) - Build tool
- [TailwindCSS](https://tailwindcss.com/) - CSS framework
- [Chart.js](https://www.chartjs.org/) - Charting library
- [Firebase](https://firebase.google.com/) - Backend services
- [Heroicons](https://heroicons.com/) - Icon library

## 📞 Support

If you have any questions or need help:

- 📧 Email: support@etfdashboard.com
- 💬 Discord: [Join our community](https://discord.gg/etfdashboard)
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/etf-dashboard/issues)

---

Made with ❤️ by the ETF Dashboard Team
#   N e w - E T F - T r a c k e r  
 #   N e w - E T F - T r a c k e r  
 