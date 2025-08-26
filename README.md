# TV App

A React Native TV application with a modern authentication flow and comprehensive customer management dashboard.

## Features

- **Splash Screen**: Animated welcome screen with app branding
- **Login Screen**: Email and password authentication with validation
- **Registration Screen**: User registration with form validation
- **Dashboard**: Complete customer management system with multiple screens
- **Modern UI**: Light theme with consistent styling
- **Navigation**: Smooth transitions between screens using React Navigation

## Screens

### 1. Splash Screen
- Animated logo and app name
- Auto-navigation to login after 3 seconds
- Modern light theme design

### 2. Login Screen
- Email and password input fields
- Form validation
- "Forgot Password" link
- Navigation to registration screen
- Loading state during authentication

### 3. Registration Screen
- Full name, email, password, and confirm password fields
- Comprehensive form validation
- Password strength requirements
- Navigation back to login screen

### 4. Dashboard (Main App)
The dashboard includes four main screens accessible via bottom navigation:

#### **Overview Screen (Home)**
- Key metrics cards (Total Customers, Active Customers, Monthly Revenue, etc.)
- Performance indicators with percentage changes
- Upcoming recharges list with customer avatars
- Notification bell icon

#### **Customers Screen**
- Search functionality for customers
- Filter buttons (All, Active, Inactive)
- Customer list with avatars, names, IDs, and status
- Add customer button (+)

#### **Pending Payments Screen**
- Search functionality
- Filter dropdowns (Due Date, Amount)
- Payment list with customer details and amounts
- Back navigation

#### **Settings Screen**
- Profile settings, notifications, privacy options
- Payment methods and help support
- Logout functionality

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. For iOS, install pods:
   ```bash
   cd ios && pod install && cd ..
   ```

## Running the App

### iOS
```bash
npm run ios
```

### Android
```bash
npm run android
```

## Dependencies

- React Native 0.80.2
- React Navigation 7.x (Stack & Bottom Tabs)
- React Native Gesture Handler
- React Native Screens
- React Native Safe Area Context

## Project Structure

```
src/
├── screens/
│   ├── SplashScreen.tsx
│   ├── LoginScreen.tsx
│   ├── RegisterScreen.tsx
│   ├── DashboardScreen.tsx
│   ├── OverviewScreen.tsx
│   ├── CustomersScreen.tsx
│   ├── PendingPaymentsScreen.tsx
│   └── SettingsScreen.tsx
App.tsx
index.js
```

## Styling

The app uses a consistent light theme with the following color palette:
- Primary Background: `#ffffff`
- Secondary Background: `#f8f9fa`
- Primary Color: `#007bff`
- Border Color: `#dee2e6`
- Text Colors: `#212529`, `#6c757d`
- Success Color: `#28a745`
- Danger Color: `#dc3545`

## Navigation Flow

1. **Splash Screen** → Auto-navigate to Login after 3 seconds
2. **Login Screen** → Navigate to Registration or Dashboard (after successful login)
3. **Registration Screen** → Navigate back to Login (after successful registration)
4. **Dashboard** → Bottom tab navigation between:
   - Overview (Home)
   - Customers
   - Pending Payments
   - Settings

## Dashboard Features

### Overview Screen
- **Metrics Cards**: Display key business metrics with trend indicators
- **Upcoming Recharges**: List of customers with pending payments
- **Real-time Data**: Simulated data for demonstration

### Customers Screen
- **Search & Filter**: Find and filter customers by status
- **Customer Management**: View customer details and status
- **Add Customer**: Quick access to add new customers

### Pending Payments Screen
- **Payment Tracking**: Monitor overdue and upcoming payments
- **Advanced Filtering**: Filter by due date and amount
- **Payment Details**: View customer and payment information

### Settings Screen
- **App Configuration**: Various app settings and preferences
- **User Management**: Profile and account settings
- **Logout**: Secure logout functionality

## Development Notes

- The app currently uses simulated API calls for authentication and data
- Form validation includes email format and password strength checks
- All screens are optimized for TV interfaces with proper focus management
- The design follows modern UI/UX principles for business applications
- Bottom navigation provides easy access to all main features

## Future Enhancements

- Real API integration for authentication and data
- User profile management
- Advanced customer analytics
- Payment processing integration
- Push notifications
- Offline mode support
- Data export functionality
