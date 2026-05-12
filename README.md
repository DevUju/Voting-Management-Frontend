# Poll & Voting System

A modern, responsive web application for creating, managing, and participating in polls and voting systems. Built with Angular 17, this application provides a seamless experience for users to create polls, vote on them, and view results, while administrators can manage the entire system.

##  Features

### For Users
- **User Authentication**: Secure login and signup functionality
- **Dashboard**: View all active polls in a clean, organized layout
- **Voting**: Participate in polls with a user-friendly interface
- **Results**: View poll results with percentage breakdowns and state-wise filtering
- **Profile Management**: Update personal information

### For Administrators
- **Poll Creation**: Create new polls with multiple options (2-4 options required)
- **Poll Management**: Update, close, or delete existing polls
- **Admin Panel**: Comprehensive interface for managing all polls
- **Real-time Updates**: Immediate feedback on poll status changes

### Design & UX
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Modern UI**: Clean, professional interface using a custom color palette
- **Accessibility**: Built with accessibility best practices
- **State-wise Results**: Filter voting results by Nigerian states

##  Color Palette

- **Primary**: #1F6F5F (Headers, main elements)
- **Secondary**: #2FA084 (Buttons, highlights)
- **Accent**: #6FCF97 (Hover states, confirmations)
- **Background**: #EEEEEE (Neutral backgrounds)
- **Fonts**: Inter, Roboto, Open Sans (fallback)

##  Tech Stack

- **Frontend Framework**: Angular 17
- **Language**: TypeScript
- **Styling**: CSS with custom properties
- **State Management**: RxJS for reactive programming
- **HTTP Client**: Angular HttpClient
- **Forms**: Reactive Forms with validation
- **Routing**: Angular Router with guards
- **Build Tool**: Angular CLI

##  Prerequisites

- Node.js (v18 or higher)
- npm (comes with Node.js)
- Angular CLI (v17+)

##  Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd poll_system
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment
Update `src/environments/environment.ts` with your backend API URL:
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api/v1'
};
```

### 4. Start Development Server
```bash
ng serve
```
Or using npm script:
```bash
npm start
```

Navigate to `http://localhost:4200` in your browser.

### 5. Build for Production
```bash
ng build --prod
```

##  Usage

### User Flow
1. **Register/Login**: Create an account or log in
2. **Browse Polls**: View active polls on the dashboard
3. **Vote**: Select your preferred option and submit
4. **View Results**: Check poll outcomes and statistics

### Admin Flow
1. **Access Admin Panel**: Navigate to `/admin` (admin role required)
2. **Create Polls**: Use the form to create new polls with 2-4 options
3. **Manage Polls**: Update existing polls, close voting, or delete polls
4. **Monitor Activity**: View all polls and their current status

##  Project Structure

```
src/
├── app/
│   ├── auth/                    # Authentication components
│   │   ├── login/              # Login component
│   │   ├── signup/             # Signup component
│   │   ├── guards/             # Route guards
│   │   └── interceptors/       # HTTP interceptors
│   ├── polls/                  # Poll-related components
│   │   ├── dashboard/          # Poll listing
│   │   ├── poll-detail/        # Individual poll view
│   │   ├── admin-panel/        # Admin management interface
│   │   └── poll.service.ts     # Poll API service
│   ├── votes/                  # Voting components
│   │   ├── results/            # Results display
│   │   └── vote.service.ts     # Vote API service
│   ├── profile/                # User profile management
│   ├── header/                 # Navigation header
│   ├── app.component.*         # Root component
│   └── app.routes.ts           # Application routes
├── environments/               # Environment configurations
├── styles.css                  # Global styles
└── index.html                  # Main HTML template
```

##  Development

### Available Scripts
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm run test` - Run unit tests
- `npm run lint` - Run ESLint

### Code Quality
- Follows Angular style guide
- Uses TypeScript strict mode
- Implements reactive forms with validation
- Includes error handling and loading states

##  Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

##  Key Features

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

##  Styling

The application uses SCSS with a custom CSS variable-based design system:

```scss
--primary-color: #007bff
--secondary-color: #6c757d
--success-color: #28a745
--danger-color: #dc3545
--warning-color: #ffc107
```

Responsive design with mobile-first approach.

##  Authentication Flow

1. User signs up → Account created with state
2. User logs in → JWT token received and stored
3. Token automatically added to API requests
4. Token validated on protected routes
5. User logged out → Token cleared

##  API Integration

Backend API configuration in services:
```typescript
private apiUrl = 'http://localhost:3000/api/v1';
```

Update to your backend URL if different.


##  Responsive Design

- **Desktop** (1024px+) - Full layout with side-by-side components
- **Tablet** (768px-1023px) - Adjusted grid layout
- **Mobile** (< 768px) - Stacked layout

##  Production Build

```bash
npm run build
# Output in dist/poll-voting-frontend
```

Deploy the `dist/poll-voting-frontend` folder to your hosting.

##  Configuration

### API Endpoint
Update in service files if backend URL changes:
```typescript
private apiUrl = 'http://your-backend-url:3000/api/...';
```

### Frontend URL (for CORS)
Update backend `.env` file:
```env
FRONTEND_URL=http://localhost:4200/
```

##  User Flows

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
5. Close, Reopen or delete polls as needed

##  Data Models

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

##  Security

- JWT tokens stored in localStorage
- Automatic token inclusion in API requests
- Route guards protect authenticated pages
- Admin-only pages require admin role

##  Form Validation

- **Reactive Forms** with real-time validation
- Email format validation
- Password minimum length (6 characters)
- Required field validation
- State selection required

##  Error Handling

- API errors displayed in alert messages
- Loading states for async operations
- Graceful fallbacks for failed requests
- User-friendly error messages

##  Troubleshooting

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

##  Component Examples

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

##  Contributing

1. Create feature branch: `git checkout -b feature/name`
2. Make changes
3. Test locally
4. Commit: `git commit -am 'Add feature'`
5. Push: `git push origin feature/name`
6. Submit PR


##  Support

For questions or support, please open an issue in the repository or contact the development team.

---

**Built with Angular 17** 
