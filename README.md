# Frontend - Poll & Voting System

Angular 17 frontend for the Poll & Voting System application.

## 📋 Prerequisites

- Node.js (v18+)
- npm
- Angular CLI (installed globally or via npx)

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm start
```

Navigate to http://localhost:4200 in your browser.

## 📁 Project Structure

```
src/
├── app/
│   ├── pages/              # Route components
│   │   ├── login/
│   │   ├── signup/
│   │   ├── dashboard/
│   │   ├── poll-detail/
│   │   ├── results/
│   │   ├── admin-panel/
│   │   └── profile/
│   ├── services/           # HTTP services
│   │   ├── auth.service.ts
│   │   ├── poll.service.ts
│   │   └── vote.service.ts
│   ├── guards/             # Route guards
│   │   └── auth.guard.ts
│   ├── interceptors/       # HTTP interceptors
│   │   └── auth.interceptor.ts
│   ├── app.component.ts    # Root component
│   └── app.routes.ts       # Route definitions
├── styles.scss             # Global styles
├── main.ts                 # Entry point
└── index.html             # HTML template
```

## 🎯 Pages & Components

### Authentication Pages
- **Login** (`/login`) - User login
- **Signup** (`/signup`) - User registration with state selection

### User Pages
- **Dashboard** (`/dashboard`) - List of active polls
- **Poll Detail** (`/poll/:id`) - Vote on a specific poll
- **Results** (`/results/:id`) - View poll results with state filtering
- **Profile** (`/profile`) - View user information

### Admin Pages
- **Admin Panel** (`/admin`) - Create, manage, and close polls

## 📦 Available Scripts

```bash
npm start              # Start dev server (ng serve)
npm run build          # Build for production
npm run watch          # Build with watch mode
npm run test           # Run unit tests
npm run lint           # Run linter
```

## 🔑 Key Features

### Services

**AuthService** (`services/auth.service.ts`)
- User registration and login
- JWT token management
- User profile retrieval
- Authentication state management

**PollService** (`services/poll.service.ts`)
- CRUD operations for polls
- Fetch active/all polls
- Poll status management

**VoteService** (`services/vote.service.ts`)
- Submit votes
- Retrieve poll results
- Filter results by state
- Check user's vote status

### Guards

**authGuard** - Protects routes requiring authentication
**adminGuard** - Protects admin-only routes

### Interceptors

**authInterceptor** - Automatically adds JWT token to requests

## 🎨 Styling

The application uses SCSS with a custom CSS variable-based design system:

```scss
--primary-color: #007bff
--secondary-color: #6c757d
--success-color: #28a745
--danger-color: #dc3545
--warning-color: #ffc107
```

Responsive design with mobile-first approach.

## 🔐 Authentication Flow

1. User signs up → Account created with state
2. User logs in → JWT token received and stored
3. Token automatically added to API requests
4. Token validated on protected routes
5. User logged out → Token cleared

## 📡 API Integration

Backend API configuration in services:
```typescript
private apiUrl = 'http://localhost:3000/api/...';
```

Update to your backend URL if different.

## 🧪 Testing

```bash
npm run test          # Run unit tests
```

## 📱 Responsive Design

- **Desktop** (1024px+) - Full layout with side-by-side components
- **Tablet** (768px-1023px) - Adjusted grid layout
- **Mobile** (< 768px) - Stacked layout

## 🚀 Production Build

```bash
npm run build
# Output in dist/poll-voting-frontend
```

Deploy the `dist/poll-voting-frontend` folder to your hosting.

## 🔧 Configuration

### API Endpoint
Update in service files if backend URL changes:
```typescript
private apiUrl = 'http://your-backend-url:3000/api/...';
```

### Frontend URL (for CORS)
Update backend `.env` file:
```env
FRONTEND_URL=http://your-frontend-url
```

## 🎯 User Flows

### Registration Flow
1. Visit `/signup`
2. Fill form with name, email, password, state
3. Click "Sign Up"
4. Redirected to dashboard

### Voting Flow
1. View dashboard with active polls
2. Click "Vote" on a poll
3. Select an option
4. Click "Submit Vote"
5. View results on Results page

### Admin Flow
1. Log in as admin
2. Navigate to `/admin`
3. Create new poll with 2-4 options
4. View and manage created polls
5. Close or delete polls as needed

## 📊 Data Models

### User
```typescript
{
  id: string,
  name: string,
  email: string,
  state: string,
  role: 'admin' | 'user'
}
```

### Poll
```typescript
{
  id: string,
  title: string,
  description: string,
  status: 'active' | 'closed',
  options: PollOption[],
  createdAt: Date,
  updatedAt: Date
}
```

### Vote
```typescript
{
  id: string,
  userId: string,
  pollId: string,
  optionId: string,
  state: string,
  createdAt: Date
}
```

## 🛡️ Security

- JWT tokens stored in localStorage
- Automatic token inclusion in API requests
- Route guards protect authenticated pages
- Admin-only pages require admin role

## 📋 Form Validation

- **Reactive Forms** with real-time validation
- Email format validation
- Password minimum length (6 characters)
- Required field validation
- State selection required

## ⚠️ Error Handling

- API errors displayed in alert messages
- Loading states for async operations
- Graceful fallbacks for failed requests
- User-friendly error messages

## 🚨 Troubleshooting

### Port 4200 already in use
```bash
ng serve --port 4300
```

### Dependencies issues
```bash
rm -rf node_modules package-lock.json
npm install
```

### CORS errors
Ensure backend `.env` has correct `FRONTEND_URL`

### Token not persisting
Check browser localStorage settings
Ensure CORS credentials enabled

## 📖 Component Examples

### Login Component
- Form validation
- Error handling
- Redirect on success

### Dashboard Component
- Active polls list
- Grid layout
- Navigation to detail pages

### Results Component
- Vote aggregation
- State filtering
- Progress bar visualization

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/name`
2. Make changes
3. Test locally
4. Commit: `git commit -am 'Add feature'`
5. Push: `git push origin feature/name`
6. Submit PR

## 📧 Support

For issues or questions, open an issue on the repository.

---

**Built with Angular 17** ✨
