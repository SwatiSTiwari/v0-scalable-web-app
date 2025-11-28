# Scalable Web App with Authentication & Dashboard

A production-ready web application built with Next.js featuring user authentication, JWT-based security, and a task management dashboard.

## Features

- **User Authentication**
  - Secure signup and login
  - JWT-based authentication (24-hour tokens)
  - HTTP-only cookie storage
  - Password hashing with SHA-256

- **Dashboard**
  - User profile display
  - Task management (Create, Read, Update, Delete)
  - Search functionality
  - Filter by task status (All, Pending, Completed)
  - Real-time task status updates

- **Security**
  - Input validation with Zod
  - Protected API endpoints
  - CORS-ready configuration
  - Error handling and logging

- **Responsive Design**
  - Mobile-first approach
  - Tailwind CSS styling
  - Shadcn/UI components
  - Accessible UI elements

## Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
\`\`\`bash
git clone <repository-url>
cd scalable-web-app
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Start the development server:
\`\`\`bash
npm run dev
\`\`\`

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Demo Credentials

For testing purposes, a demo account is pre-seeded:
- **Email:** demo@example.com
- **Password:** demo@123

## Project Structure

\`\`\`
app/
├── api/                    # Backend API routes
│   ├── auth/              # Authentication endpoints
│   │   ├── signup/route.ts
│   │   ├── login/route.ts
│   │   ├── me/route.ts
│   │   └── logout/route.ts
│   └── tasks/             # Task management endpoints
│       ├── route.ts
│       └── [id]/route.ts
├── dashboard/             # Protected dashboard pages
├── login/
├── signup/
├── page.tsx              # Homepage
└── layout.tsx            # Root layout

components/
├── auth-form.tsx         # Login/signup form component
├── task-form.tsx         # Task creation component
└── task-list.tsx         # Task list with search/filter

lib/
├── db.ts                 # In-memory database (replaceable)
├── jwt.ts                # JWT token management
├── validation.ts         # Zod schemas for validation
├── auth.ts               # Authentication utilities
└── hooks.ts              # React hooks (useAuth, useTasks)

public/
└── icons/               # App icons

README.md               # This file
API_DOCUMENTATION.md    # Detailed API docs
SCALABILITY_GUIDE.md    # Production scaling guide
\`\`\`

## Authentication Flow

1. User signs up or logs in
2. Backend validates credentials
3. JWT token is generated and stored in HTTP-only cookie
4. Frontend uses token for authenticated requests
5. Protected pages redirect to login if token is invalid

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout

### Tasks
- `GET /api/tasks` - Get all user tasks
- `POST /api/tasks` - Create new task
- `GET /api/tasks/[id]` - Get specific task
- `PATCH /api/tasks/[id]` - Update task
- `DELETE /api/tasks/[id]` - Delete task

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for detailed endpoints and examples.

## Development

### Running Tests

Currently, there are no tests in the repository. To add testing:

\`\`\`bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom
\`\`\`

### Code Quality

The project uses:
- TypeScript for type safety
- Zod for runtime validation
- ESLint for code linting

## Production Deployment

### Deploying to Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel dashboard
3. Add environment variable: `JWT_SECRET`
4. Deploy

\`\`\`bash
vercel deploy
\`\`\`

### Deploying to Other Platforms

See [SCALABILITY_GUIDE.md](./SCALABILITY_GUIDE.md) for comprehensive deployment options and strategies.

### Environment Variables

Create a `.env.local` file:

\`\`\`
JWT_SECRET=your-secret-key-change-in-production
NODE_ENV=development
\`\`\`

## Security Checklist for Production

- [ ] Change JWT_SECRET to a strong random key
- [ ] Enable HTTPS everywhere
- [ ] Set up rate limiting on API endpoints
- [ ] Implement CSRF protection
- [ ] Add request size limits
- [ ] Setup error monitoring (Sentry)
- [ ] Enable CORS for allowed domains only
- [ ] Implement API authentication (if needed)
- [ ] Setup regular backups
- [ ] Enable WAF (Web Application Firewall)

## Performance Optimization

### Current Optimizations
- HTTP-only cookies prevent XSS attacks
- JWT tokens are stateless and scale horizontally
- Client-side caching with React hooks
- Optimized database queries

### Future Optimizations
- Implement Redis caching layer
- Add database indexing
- Enable response compression
- Implement CDN for static assets
- Setup database read replicas

## Scaling Strategy

The app is structured to scale from development to production:

1. **Development Phase:** In-memory database
2. **Phase 1 (Week 2-3):** Separate Express backend + PostgreSQL
3. **Phase 2 (Week 4+):** Add Redis caching and optimization
4. **Phase 3 (Month 1-2):** Multi-region deployment
5. **Phase 4 (Month 3+):** Advanced infrastructure

See [SCALABILITY_GUIDE.md](./SCALABILITY_GUIDE.md) for detailed scaling roadmap.

## Database

Currently uses an in-memory database for demonstration. To migrate to PostgreSQL:

1. Install Prisma:
\`\`\`bash
npm install @prisma/client
npm install -D prisma
\`\`\`

2. Initialize Prisma:
\`\`\`bash
npx prisma init
\`\`\`

3. Update `lib/db.ts` to use Prisma Client
4. Define database schema in `prisma/schema.prisma`
5. Run migrations

## Troubleshooting

### Login not working
1. Check that credentials match (demo@example.com / demo@123)
2. Verify JWT_SECRET is set correctly
3. Check browser cookies are enabled
4. Review console logs for error messages

### Tasks not saving
1. Verify user is authenticated
2. Check network tab in DevTools for API errors
3. Ensure localStorage is not disabled
4. Try clearing cookies and logging in again

### CORS errors
1. Check API_DOCUMENTATION.md for allowed origins
2. Ensure backend is running on correct port
3. Verify CORS headers are set correctly

## Contributing

To contribute to this project:

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

MIT

## Support

For issues or questions:
1. Check [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
2. Review [SCALABILITY_GUIDE.md](./SCALABILITY_GUIDE.md)
3. Open an issue on GitHub

## Roadmap

- [ ] Email verification
- [ ] Password reset flow
- [ ] Two-factor authentication
- [ ] OAuth integration (Google, GitHub)
- [ ] Role-based access control
- [ ] Task categories/tags
- [ ] Collaborative tasks
- [ ] Task comments and attachments
- [ ] Analytics dashboard
- [ ] Mobile app

## Credits

Built with:
- [Next.js](https://nextjs.org/)
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Shadcn/UI](https://ui.shadcn.com/)
- [Zod](https://zod.dev/)
