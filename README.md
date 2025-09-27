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

### 🔐 Authentication (Appwrite)
- **JWT Authentication** - Secure token-based authentication
- **Email/Password** - Traditional email-based authentication
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
