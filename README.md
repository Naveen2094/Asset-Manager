# NIDHI Asset Manager

A modern asset management platform built with React Native, Expo, TypeScript, Node.js, and Drizzle ORM.

## Overview

NIDHI Asset Manager helps organizations efficiently track, manage, and monitor physical and digital assets through a mobile-first experience.

The application provides:

- Asset registration and tracking
- Asset allocation and ownership management
- Real-time asset status monitoring
- Search and filtering capabilities
- Multi-language support
- Secure backend APIs
- Cross-platform mobile experience

---

## Tech Stack

### Frontend

- React Native
- Expo
- Expo Router
- TypeScript

### Backend

- Node.js
- Express.js
- Drizzle ORM

### Database

- PostgreSQL (Drizzle ORM)

### Mobile

- Android
- iOS (via Expo)

---

## Project Structure

```text
NIDHI-Asset-Manager/
│
├── app/                # Application screens and routes
├── components/         # Reusable UI components
├── assets/             # Images, icons, and static resources
├── constants/          # Application constants
├── lib/                # Utility functions and helpers
├── locales/            # Localization files
├── shared/             # Shared types and interfaces
├── server/             # Backend APIs and services
├── android/            # Native Android project
│
├── package.json
├── tsconfig.json
└── README.md
```

---

## Features

### Asset Management

- Create assets
- Update asset information
- Delete assets
- Asset categorization

### Tracking

- Ownership tracking
- Allocation history
- Asset lifecycle monitoring

### Search & Filters

- Quick asset lookup
- Category-based filtering
- Advanced search capabilities

### Localization

- Multi-language support
- Region-specific formatting

### Mobile Experience

- Responsive UI
- Offline-friendly architecture
- Native Android support

---

## Installation

### Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI
- PostgreSQL Database

---

### Clone Repository

```bash
git clone https://github.com/yourusername/nidhi-asset-manager.git

cd nidhi-asset-manager
```

### Install Dependencies

```bash
npm install
```

or

```bash
yarn install
```

---

## Environment Setup

Create a `.env` file:

```env
DATABASE_URL=your_database_url
PORT=5000
```

Add any additional environment variables required by the project.

---

## Database Setup

Push database schema using Drizzle:

```bash
npm run db:push
```

---

## Run Backend

```bash
npm run dev
```

---

## Run Mobile App

Start Expo:

```bash
npx expo start
```

Run Android:

```bash
npx expo run:android
```

Run iOS:

```bash
npx expo run:ios
```

---

## Build Production App

### Android

```bash
eas build --platform android
```

### iOS

```bash
eas build --platform ios
```

---

## Scripts

```bash
npm run dev          # Start development server
npm run build        # Production build
npm run start        # Start production server
npm run db:push      # Push database schema
```

---

## Security

- Environment-based configuration
- API validation
- Database abstraction via Drizzle ORM
- Secure authentication architecture

---

## Roadmap

- [ ] Asset QR Code Support
- [ ] Asset Audit Module
- [ ] Notification System
- [ ] Role-Based Access Control
- [ ] Analytics Dashboard
- [ ] Asset Maintenance Scheduling

---

## Contributing

Contributions are welcome.

1. Fork the repository
2. Create a feature branch

```bash
git checkout -b feature/new-feature
```

3. Commit changes

```bash
git commit -m "Add new feature"
```

4. Push branch

```bash
git push origin feature/new-feature
```

5. Open a Pull Request

---

## License

This project is licensed under the MIT License.

---

## Author

**Naveen**
