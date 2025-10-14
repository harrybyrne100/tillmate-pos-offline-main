# TillMate - Progressive Web App (PWA)

TillMate is an offline-first point of sale system built as a Progressive Web App. This means you can install it on your device and use it without an internet connection.

![TillMate POS](https://images.unsplash.com/photo-1556740758-90de374c12ad?w=800&h=400&fit=crop)

## ✨ Key Features

- 🚀 **Offline-First**: Works without internet connection
- 📱 **PWA**: Install on any device for app-like experience
- 💳 **Quick Checkout**: Streamlined POS interface for fast transactions
- 📊 **Sales Analytics**: Track revenue and performance metrics
- 🗄️ **Local Storage**: All data stored in IndexedDB
- 🌓 **Theme Toggle**: Light/Dark/System theme support
- 📱 **Responsive**: Optimized for mobile, tablet, and desktop

## 📱 Installing TillMate as a PWA

### On Desktop (Chrome, Edge, Brave)

1. **Visit the app** in your browser
2. Look for the **install icon** (➕ or ⬇️) in the address bar
3. Click **"Install"** when prompted
4. The app will open in its own window without browser UI
5. Find TillMate in your applications menu or desktop

**Alternative method:**
- Click the three-dot menu (⋮) in your browser
- Select **"Install TillMate"** or **"Add to Desktop"**

### On Mobile (iOS - Safari)

1. **Open TillMate** in Safari browser
2. Tap the **Share button** (□↑) at the bottom
3. Scroll down and tap **"Add to Home Screen"**
4. Edit the name if desired and tap **"Add"**
5. The app icon will appear on your home screen
6. Tap the icon to launch TillMate in full-screen mode

### On Mobile (Android - Chrome)

1. **Open TillMate** in Chrome browser
2. Tap the three-dot menu (⋮) in the top right
3. Select **"Add to Home screen"** or **"Install app"**
4. Tap **"Install"** or **"Add"** when prompted
5. The app icon will appear on your home screen
6. Tap to launch TillMate in standalone mode

## 📸 Screenshots

### POS Interface
The main point-of-sale screen with product grid and checkout cart.

![POS Screen](https://images.unsplash.com/photo-1556742111-a301076d9d18?w=800&h=500&fit=crop)

### Daily Sales Dialog
View detailed sales data for any specific day with item breakdowns.

![Daily Sales](https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=500&fit=crop)

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + K` | Focus search bar (Products page) |
| `Ctrl/Cmd + N` | Add new product |
| `Enter` | Complete checkout (when cart has items) |
| `Esc` | Close dialogs/modals |
| `Tab` | Navigate between form fields |
| `Space` | Select product card (when focused) |

## 🔒 Privacy & Security

**Data Storage**: TillMate stores all data locally in your browser using IndexedDB. No data is sent to external servers.

**Customer Information**: 
- Customer names are **optional** during checkout
- Avoid storing Personally Identifiable Information (PII)
- If collecting customer data, ensure compliance with local privacy laws (GDPR, CCPA, etc.)
- Consider this a transaction-only system unless you implement additional security measures

**Recommendations**:
- Use generic identifiers instead of full names
- Clear old transaction data regularly
- Do not store sensitive payment information
- This system is designed for local, offline use only

## 🧪 Testing

Run the test suite:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- ProductCard.test.tsx
```

Test files are located next to their components with `.test.tsx` extension.

## ✨ PWA Features

- **Offline Support**: Continue working without internet connection
- **Auto-sync**: Changes sync when connection is restored
- **App-like Experience**: Full-screen, native-like interface
- **Fast Loading**: Cached assets for instant startup
- **Install Prompt**: Browser will suggest installing the app
- **Update Notifications**: Automatic updates when available

## 🔧 Development Setup

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## 🛠️ Technologies

This project is built with:

- **Vite** - Fast build tool and dev server
- **TypeScript** - Type-safe JavaScript
- **React** - UI library
- **shadcn-ui** - Beautiful component library
- **Tailwind CSS** - Utility-first CSS
- **vite-plugin-pwa** - PWA integration with Workbox
- **IndexedDB** - Local database for offline storage

## 📦 PWA Configuration

The app uses `vite-plugin-pwa` with the following features:

- **App Shell Caching**: Core app files cached for instant loading
- **Static Asset Caching**: Images, fonts, and styles cached
- **Runtime Caching**: Smart caching of external resources
- **Offline Fallback**: App continues to work without internet
- **Auto Updates**: Service worker updates automatically
- **Manifest**: Proper PWA manifest for installation

## 🚀 What I'd Build Next

If I were to continue developing TillMate, here are the features I'd add:

### High Priority
- **🔍 Barcode Scanner**: Integrate camera-based barcode scanning for quick product lookup
- **💰 Tax Calculation**: Configurable tax rates with automatic calculation
- **🎫 Discount System**: Percentage and fixed-amount discounts, coupon codes
- **📊 Advanced Analytics**: 
  - Sales trends over time
  - Top-selling products
  - Peak hours analysis
  - Category performance
- **🖨️ Receipt Printing**: Browser print API integration for physical receipts

### Medium Priority
- **👥 Multi-user Support**: Staff accounts with role-based permissions
- **📦 Inventory Management**: 
  - Low stock alerts
  - Automatic reorder points
  - Purchase order tracking
- **💳 Payment Integration**: Stripe Terminal or Square for card payments
- **🔄 Cloud Sync**: Optional backup to cloud storage
- **📱 Customer Display**: Second screen for customer-facing display

### Nice to Have
- **📈 Advanced Reporting**: Export sales data to CSV/PDF
- **🎯 Customer Loyalty Program**: Points and rewards system
- **🌍 Multi-currency Support**: International currency handling
- **🔔 Push Notifications**: Low stock alerts, daily sales summaries
- **🎨 Custom Themes**: Configurable color schemes and branding
- **🔌 Hardware Integration**: Cash drawer, receipt printer, scale integration

### Technical Improvements
- **⚡ Performance**: Virtual scrolling for large product catalogs
- **🧪 E2E Testing**: Playwright or Cypress test suite
- **♿ Accessibility**: WCAG 2.1 AA compliance audit
- **🌐 i18n**: Multi-language support
- **📱 Native Apps**: Capacitor for native iOS/Android versions
