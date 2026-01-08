# Cadet Cart - Client

React frontend application for the Cadet Cart e-commerce platform.

## Tech Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client
- **Socket.io Client** - Real-time communication
- **React Hot Toast** - Toast notifications

## Development

```bash
npm install
npm run dev
```

The application will be available at http://localhost:5173

## Build

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/         # Page components
├── context/       # React context providers
├── hooks/         # Custom React hooks
├── services/      # API service functions
├── utils/         # Utility functions
└── App.jsx        # Main app component
```

## Environment Variables

The client uses Vite's proxy configuration to connect to the backend API during development.