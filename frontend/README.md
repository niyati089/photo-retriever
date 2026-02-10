# Photo Retriever Frontend

Production-ready Next.js frontend for the Photo Retriever application.

## Technology Stack

- **Framework**: Next.js 15+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **HTTP Client**: Axios
- **State Management**: React Hooks + Context

## Features

- 🔐 **Authentication**: Login and signup with role-based access (user, photographer, admin)
- 👤 **User Dashboard**: Selfie upload and AI-powered photo search
- 📸 **Photographer Dashboard**: Bulk photo upload with drag-and-drop and status tracking
- ⚙️ **Admin Dashboard**: Photo approval interface with batch actions and platform statistics
- 🎨 **Modern UI**: Responsive design with Tailwind CSS, custom components, and animations
- 🚀 **Performance**: Optimized image handling, lazy loading, and code splitting
- 🛡️ **Error Handling**: Comprehensive error boundaries and user-friendly error messages

## Project Structure

```
frontend/
├── app/                      # Next.js App Router pages
│   ├── dashboard/           # Dashboard pages (user, photographer, admin)
│   ├── login/              # Login page
│   ├── signup/             # Signup page
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Landing page
│   └── globals.css         # Global styles
├── components/              # React components
│   ├── auth/               # Authentication components
│   ├── dashboard/          # Dashboard-specific components
│   ├── layout/             # Layout components (Navbar, Sidebar)
│   └── ui/                 # Reusable UI components
├── lib/                     # Utilities and API clients
│   ├── api.ts              # API client with typed endpoints
│   ├── auth.ts             # Authentication helpers
│   └── utils.ts            # General utilities
└── types/                   # TypeScript type definitions
    ├── auth.ts             # Authentication types
    ├── photo.ts            # Photo types
    └── user.ts             # User types
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create environment file:
   ```bash
   cp .env.example .env.local
   ```

3. Update `.env.local` with your backend API URL:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

### Development

Start the development server:

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

### Build

Build for production:

```bash
npm run build
```

Start production server:

```bash
npm start
```

## User Roles

### User
- Upload selfie for reference
- Search for photos using AI matching
- View and download matched photos

### Photographer
- Upload event photos (single or batch)
- View upload status and approval state
- Manage uploaded photos

### Admin
- Review and approve/reject photo uploads
- Batch approval actions
- View platform statistics
- Manage users

## API Integration

The frontend uses placeholder API endpoints. To connect with the backend:

1. Ensure backend is running on the URL specified in `NEXT_PUBLIC_API_URL`
2. API endpoints are defined in `lib/api.ts`
3. Authentication tokens are automatically included in requests
4. Error handling is managed by axios interceptors

### API Endpoints

- **Auth**: `/api/auth/login`, `/api/auth/signup`, `/api/auth/logout`
- **Photos**: `/api/photos/upload`, `/api/photos`, `/api/photos/status`
- **User**: `/api/users/selfie`, `/api/users/search`
- **Admin**: `/api/admin/approvals`, `/api/admin/stats`, `/api/admin/users`

## Components

### UI Components
- **Button**: Multiple variants (primary, secondary, danger, ghost, outline)
- **Input**: Form input with validation and error states
- **Card**: Container with header, body, and footer sections
- **Modal**: Overlay modal with backdrop
- **LoadingSpinner**: Loading indicators
- **ErrorBoundary**: Error catching and fallback UI

### Layout Components
- **Navbar**: Top navigation with user menu
- **Sidebar**: Role-based side navigation for dashboards

### Dashboard Components
- **PhotoUpload**: Drag-and-drop photo upload with progress
- **SelfieUpload**: Single photo upload for user reference
- **PhotoGallery**: Photo grid with modal preview
- **UploadStatus**: Photographer upload tracking
- **ApprovalInterface**: Admin photo approval system

## Responsive Design

The application is fully responsive:
- **Desktop**: Full sidebar navigation and multi-column layouts
- **Tablet**: Collapsible sidebar with optimized layouts
- **Mobile**: Hamburger menu navigation and stacked layouts

## Theme Customization

Theme colors are defined in `app/globals.css`:

```css
--primary: #3b82f6;
--secondary: #64748b;
--accent: #8b5cf6;
--success: #10b981;
--warning: #f59e0b;
--error: #ef4444;
```

## Error Handling

- Form validation with inline error messages
- Global error boundary for React errors
- API error handling with user-friendly messages
- Network error detection and retry logic

## Performance Optimization

- Image optimization with Next.js Image component
- Code splitting and lazy loading
- Efficient state management
- Optimized bundle size

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

This project is part of the PhotoRetriever monorepo.
