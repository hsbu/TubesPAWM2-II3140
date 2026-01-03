# Webculus Mobile - Your Mobile-Based Calculus Friend!

A modern, interactive mobile application for learning calculus concepts including linear equations, linear inequalities, and non-linear systems with 2 variables. Built with React Native, Expo, and Supabase database.

## Group 12 II3140 K2
```
In the loving memory of Muhammad Aidan Fathullah - 18223002,
this project is developed and maintained by Muhamad Hasbullah Faris - 18223014
```

## Features

### Interactive Learning
- **4 Comprehensive Lessons**: Linear Equations, Linear Inequalities, Non-Linear Systems, and Calculus Applications
- **Interactive Content**: MathJax-style mathematical equations and explanations
- **Touch-Optimized UI**: Native mobile experience with smooth gestures
- **Offline-Ready**: AsyncStorage for local data persistence

### Practice & Assessment
- **Practice Problems**: Database-driven practice questions for each lesson
- **Instant Feedback**: Real-time validation of answers
- **Progress Tracking**: Track completion percentage and correct answers
- **Difficulty Selection**: Choose between Easy, Medium, and Hard problems

### Dashboard & Analytics
- **Stats Overview**: Lessons completed, problems solved, accuracy rate, and current streak
- **Progress Charts**: Visual representation using react-native-svg (Bar & Line charts)
- **Weekly Accuracy Trends**: Track your performance over time
- **Recent Activity**: View your latest practice sessions

### Authentication
- **Email/Password**: Traditional authentication with Supabase
- **Session Management**: Secure JWT-based authentication with AsyncStorage
- **Profile Management**: Update name and email

## Tech Stack

### Mobile App
- **Framework**: [React Native](https://reactnative.dev/) with [Expo SDK 54](https://expo.dev/)
- **Language**: TypeScript 5
- **Navigation**: Expo Router (file-based routing)
- **UI Components**: Custom components with inline StyleSheet
- **Styling**: Theme constants with responsive breakpoints
- **State Management**: React Context API
- **Charts**: react-native-svg for custom visualizations
- **Icons**: lucide-react-native

### Backend
- **Database**: [Supabase](https://supabase.com/) (PostgreSQL)
- **API**: RESTful API (Express.js backend)
- **Authentication**: Supabase Auth + JWT
- **Security**: 
  - CORS configured
  - JWT token verification
  - Input validation & sanitization

### React Native Features
- **AsyncStorage**: Local data persistence
- **LinearGradient**: Glassmorphism UI theme
- **SVG Charts**: Custom bar and line charts
- **Drawer Navigation**: Touch-friendly side menu
- **Responsive Design**: Breakpoints for tablet support

### Database Schema
- **users**: User profiles and authentication
- **lessons**: Lesson metadata
- **practice_problems**: Questions and answers
- **practice_attempts**: User attempt records
- **user_lesson_progress**: Progress tracking

## Project Structure

```
TubesPAWM2-II3140/
├── app/                          # Expo Router pages
│   ├── _layout.tsx               # Root layout with Drawer
│   ├── index.tsx                 # Home page
│   ├── dashboard.tsx             # Dashboard page
│   ├── practice.tsx              # Practice page
│   ├── settings.tsx              # Settings page
│   ├── auth/
│   │   ├── signin.tsx            # Sign in page
│   │   └── signup.tsx            # Sign up page
│   └── lessons/
│       ├── index.tsx             # Lessons list
│       ├── linear-equations.tsx
│       ├── linear-inequalities.tsx
│       ├── nonlinear-systems.tsx
│       └── calculus-applications.tsx
│
├── components/
│   ├── custom-drawer.tsx         # Drawer navigation content
│   ├── math-content.tsx          # Math content renderer
│   └── ui/
│       ├── button.tsx            # Button component
│       ├── card.tsx              # Card component
│       └── input.tsx             # Input component
│
├── context/
│   └── auth-context.tsx          # Authentication context
│
├── hooks/
│   ├── use-lesson-progress.ts   # Lesson progress hook
│   └── use-responsive.ts        # Responsive design hook
│
├── lib/
│   ├── api.ts                    # API client functions
│   └── utils.ts                  # Utility functions
│
├── constants/
│   └── colors.ts                 # Theme colors and spacing
│
├── assets/                       # Static assets
│
├── .env                          # Environment variables
├── app.json                      # Expo configuration
├── eas.json                      # EAS Build configuration
├── package.json
├── tsconfig.json
└── README.md
```

## Getting Started

### Prerequisites

- **Node.js** 18+ 
- **pnpm** (recommended) or npm
- **Expo CLI** (installed globally)
- **Supabase Account** (for database)
- **EAS CLI** (for building APK/IPA)
- **Android Studio** or **Xcode** (for emulator)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd TubesPAWM2-II3140
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Set up Environment Variables**

   Create `.env` file in root directory:
   ```env
   EXPO_PUBLIC_API_URL=https://webculusbackend.vercel.app
   ```

4. **Configure EAS Build**

   The project already has `eas.json` configured for Android APK builds.

   ```json
   {
     "build": {
       "preview": {
         "android": {
           "buildType": "apk"
         }
       },
       "production": {
         "android": {
           "buildType": "apk"
         }
       }
     }
   }
   ```

### Running the Application

1. **Start Expo Development Server**
   ```bash
   npx expo start
   ```

2. **Run on Android Emulator**
   ```bash
   npx expo start --android
   ```

3. **Run on iOS Simulator** (macOS only)
   ```bash
   npx expo start --ios
   ```

4. **Run on Web**
   ```bash
   npx expo start --web
   ```

5. **Scan QR Code**
   - Install Expo Go app on your phone
   - Scan QR code from terminal

### Building for Production

1. **Install EAS CLI**
   ```bash
   npm install -g eas-cli
   ```

2. **Login to Expo**
   ```bash
   eas login
   ```

3. **Build APK for Android**
   ```bash
   eas build --platform android --profile production
   ```

4. **Build for iOS**
   ```bash
   eas build --platform ios --profile production
   ```

### Available Scripts

```bash
npm start          # Start Expo development server
npm run android    # Start on Android emulator
npm run ios        # Start on iOS simulator
npm run web        # Start on web browser
npm run build:web  # Export for web deployment
```

## Usage Guide

1. **Sign Up / Sign In**
   - Open the app
   - Tap "Sign In / Sign Up" button
   - Use email/password authentication

2. **Explore Lessons**
   - Navigate to Lessons from drawer menu
   - Tap on a lesson card
   - Read interactive content with mathematical equations
   - Scroll through step-by-step examples

3. **Practice Problems**
   - Go to Practice page from drawer menu
   - Select a lesson from sidebar
   - Choose difficulty level (Easy, Medium, Hard)
   - Answer questions and get instant feedback
   - Track your progress

4. **View Dashboard**
   - Monitor your stats (completion, accuracy, streak)
   - View progress bar charts
   - Check weekly accuracy line chart
   - Review recent activity

5. **Manage Settings**
   - Open drawer menu and tap Settings
   - Update profile information (name, email)
   - Sign out

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/signin` - Login user
- `GET /api/me` - Get current user

### Lessons
- `GET /api/lessons` - Get all lessons
- `GET /api/lessons/:slug` - Get specific lesson

### Practice
- `GET /api/practice/:lessonId` - Get practice problems
- `POST /api/practice/attempt` - Submit answer
- `GET /api/practice/attempts/:lessonId` - Get previous attempts

### Progress
- `GET /api/user/progress` - Get user progress
- `POST /api/user/progress` - Update progress
- `GET /api/user/dashboard-stats` - Get dashboard statistics

### Settings
- `PUT /api/user/profile` - Update profile

## Deployment

### Web Deployment (Vercel)

The mobile app can also be deployed as a web application using Vercel:

1. **Build for web**
   ```bash
   npx expo export -p web
   ```

2. **Deploy to Vercel**
   ```bash
   vercel
   ```

3. **Configuration**
   - `vercel.json` is already configured
   - Output directory: `dist`
   - Environment variable: `EXPO_PUBLIC_API_URL`

### Mobile Distribution

1. **Android APK**
   - Build with EAS: `eas build --platform android --profile production`
   - Download APK from EAS dashboard
   - Distribute via Google Play Store or direct APK installation

2. **iOS IPA**
   - Build with EAS: `eas build --platform ios --profile production`
   - Download IPA from EAS dashboard
   - Distribute via Apple App Store or TestFlight

## How to Contribute

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

The code in this project is licensed under MIT license.

## Acknowledgments

- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [Expo Documentation](https://docs.expo.dev/)
- [Supabase](https://supabase.com/)
- [lucide-react-native](https://lucide.dev/)
- [react-native-svg](https://github.com/software-mansion/react-native-svg)
