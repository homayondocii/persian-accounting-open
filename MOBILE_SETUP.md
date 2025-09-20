# Mobile App Setup (React Native)

## 📱 Cross-Platform Mobile Configuration

This template provides the foundation for creating a React Native mobile application that shares business logic with the web application.

### Prerequisites
- Node.js 18+
- React Native CLI
- Android Studio (for Android development)
- Xcode (for iOS development - macOS only)

### Setup Commands

```bash
# Create React Native project
npx react-native init AccountingMobile --template react-native-template-typescript

cd AccountingMobile

# Install shared dependencies
npm install @reduxjs/toolkit react-redux
npm install axios
npm install react-navigation/native @react-navigation/bottom-tabs @react-navigation/drawer
npm install react-native-vector-icons
npm install react-native-paper
npm install react-i18next i18next

# Android-specific dependencies
npm install react-native-screens react-native-safe-area-context
```

### Shared Business Logic Structure

```
shared/
├── services/
│   ├── api.ts           # API service layer
│   ├── auth.ts          # Authentication service
│   └── storage.ts       # Data persistence
├── store/
│   ├── slices/          # Redux slices (shared with web)
│   └── store.ts         # Store configuration
├── types/
│   └── index.ts         # TypeScript interfaces (shared with web)
├── utils/
│   ├── constants.ts     # App constants
│   ├── helpers.ts       # Utility functions
│   └── validation.ts    # Form validation schemas
└── i18n/
    ├── fa.json          # Persian translations
    └── en.json          # English translations
```

### Persian/RTL Support for Mobile

```typescript
// App.tsx
import React from 'react';
import { I18nManager } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { Provider as ReduxProvider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { store } from './src/store/store';
import MainNavigator from './src/navigation/MainNavigator';
import './src/i18n/config';

// Force RTL layout
I18nManager.forceRTL(true);

const App = () => {
  return (
    <ReduxProvider store={store}>
      <PaperProvider>
        <NavigationContainer>
          <MainNavigator />
        </NavigationContainer>
      </PaperProvider>
    </ReduxProvider>
  );
};

export default App;
```

### Key Features for Cross-Platform Compatibility

1. **Shared State Management**: Redux store shared between web and mobile
2. **Common API Layer**: Same API services for both platforms
3. **Consistent Authentication**: JWT-based auth works on both platforms
4. **Offline Support**: SQLite local storage for mobile offline functionality
5. **Persian Localization**: Full RTL support with Persian translations

### Platform-Specific Features

#### Mobile-Only Features
- Biometric authentication
- Push notifications
- Camera integration for receipt scanning
- Offline data synchronization
- Contact integration

#### Build Commands

```bash
# Android
npx react-native run-android

# iOS (macOS only)
npx react-native run-ios

# Release builds
cd android && ./gradlew assembleRelease  # Android
npx react-native run-ios --configuration Release  # iOS
```

### Integration with Backend

The mobile app uses the same REST API endpoints as the web application:

```typescript
// Mobile API configuration
const API_BASE_URL = __DEV__ 
  ? 'http://10.0.2.2:3000/api'  // Android emulator
  : 'https://your-production-api.com/api';

// Shared API service
export const mobileApiService = {
  login: (credentials) => api.post('/auth/login', credentials),
  getTransactions: (params) => api.get('/financial/transactions', { params }),
  // ... other API calls
};
```

### Deployment

#### Android
1. Build APK: `cd android && ./gradlew assembleRelease`
2. Upload to Google Play Store

#### iOS
1. Build for App Store in Xcode
2. Upload to App Store Connect

This mobile configuration ensures full cross-platform compatibility while maintaining code sharing and consistent user experience.