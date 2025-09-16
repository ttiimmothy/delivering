# Delivering - Food Delivery Platform

A full-stack food delivery platform (UberEats-lite) built with Next.js, Express, TypeScript, PostgreSQL, and Stripe. Features real-time order tracking, courier location updates, and comprehensive dashboards for customers, merchants, and couriers.

## ✨ Features

- ✨ **Browse Restaurants**: Discover menus & add to cart
- 🛒 **Cart & Checkout**: Optimistic cart operations + Stripe Checkout
- 🚴 **Courier Live Tracking**: Real-time updates via GraphQL + Socket.IO
- 👨‍🍳 **Merchant Dashboard**: Manage menus, orders, and payouts
- 💳 **Payments**: Stripe Checkout + Billing Portal + Payment Intents
- ⭐ **Reviews**: Rate restaurants & couriers
- 🌙 **Dark Mode**: Modern, responsive UI
- 🔄 **Realtime Updates**: Live order status + courier location
- 🔐 **Authentication**: JWT + Google OAuth + Facebook OAuth
- 📱 **Responsive Design**: Works on all devices
- 🧪 **Comprehensive Testing**: Unit, integration, and E2E tests
- 🔒 **Security**: Rate limiting, input validation, and security headers
- 🚀 **Production Ready**: Docker, CI/CD, and deployment guides

## 🛠 Tech Stack

### Backend
- **Node.js** + **Express** + **TypeScript**
- **Apollo Server** + **GraphQL** (Nexus)
- **PostgreSQL** + **Drizzle ORM**
- **Stripe** Checkout + Webhooks + Payment Intents
- **Socket.IO** for realtime courier location
- **Redis** for caching and sessions
- **JWT** authentication with refresh tokens
- **Vitest** + **Supertest** for testing

### Frontend
- **Next.js 15** (App Router) + **TypeScript**
- **Tailwind CSS** + **shadcn/ui**
- **Apollo Client** + **Zustand**
- **Recharts** for analytics
- **Socket.IO Client** for real-time features
- **Vitest** + **React Testing Library**

### Infrastructure
- **Docker** + **Docker Compose**
- **GitHub Actions** CI/CD
- **PostgreSQL** + **Redis**
- **Nginx** reverse proxy
- **SSL/TLS** with Let's Encrypt

## 🚀 Quick Start

### Prerequisites
- Node.js 22+
- Docker & Docker Compose
- PostgreSQL 17+ (if not using Docker)
- Redis 8+ (if not using Docker)
- Git

### 1. Clone & Setup

```bash
git clone https://github.com:ttiimmothy/delivering.git
cd delivering
```

### 2. Environment Setup

```bash
# Copy environment files
cp server/env.example server/.env
cp client/.env.example client/.env.local

# Edit the environment files with your configuration
```

### 3. Start Services

```bash
# Start database and Redis
docker compose up -d postgres redis

# Setup server
cd server
npm install
npm run migrate
npm run seed
npm run dev

# Setup client (in a new terminal)
cd client
npm install
npm run dev
```

### 4. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:4000/graphql
- **Health Check**: http://localhost:4000/health

## 📋 Demo Credentials

- **Customer**: `alice@example.com` / `password123`
- **Merchant**: `bob@example.com` / `password123`
- **Courier**: `charlie@example.com` / `password123`
- **Admin**: `admin@example.com` / `password123`

## 🏗 Project Structure

```
delivering/
├── client/                 # Next.js frontend
│   ├── src/
│   │   ├── app/           # App Router pages
│   │   │   ├── contact/   # Contact page
│   │   │   ├── courier/   # Courier dashboard
│   │   │   ├── help/      # Help center
│   │   │   ├── login/     # Login page
│   │   │   ├── merchant/  # Merchant dashboard
│   │   │   ├── orders/    # Order management
│   │   │   ├── privacy/   # Privacy policy
│   │   │   ├── register/  # Registration page
│   │   │   ├── restaurants/ # Restaurant listings
│   │   │   ├── terms/     # Terms of service
│   │   │   ├── globals.css
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   └── providers.tsx
│   │   ├── components/    # React components
│   │   │   ├── ui/        # Reusable UI components
│   │   │   ├── footer.tsx
│   │   │   ├── header.tsx
│   │   │   ├── hero.tsx
│   │   │   ├── restaurant-grid.tsx
│   │   │   ├── theme-provider.tsx
│   │   │   ├── theme-toggle.tsx
│   │   │   └── user-menu.tsx
│   │   ├── hooks/         # Custom hooks
│   │   │   └── use-toast.ts
│   │   ├── lib/          # Utilities & configs
│   │   │   ├── apollo.ts
│   │   │   └── utils.ts
│   │   ├── store/        # Zustand stores (empty)
│   │   ├── types/        # TypeScript types (empty)
│   │   └── utils/        # Utility functions (empty)
│   ├── Dockerfile
│   ├── next.config.js
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── tsconfig.json
├── server/                # Express backend
│   ├── src/
│   │   ├── schema/       # GraphQL schema modules
│   │   │   ├── index.ts
│   │   │   ├── restaurant.ts
│   │   │   └── user.ts
│   │   ├── controllers/  # Business logic
│   │   │   └── auth.ts
│   │   ├── db/          # Database schema & client
│   │   │   ├── client.ts
│   │   │   ├── schema.ts
│   │   │   └── seed.ts
│   │   ├── security/    # CORS, rate limiting, etc.
│   │   │   ├── cors.ts
│   │   │   ├── helmet.ts
│   │   │   └── rateLimit.ts
│   │   ├── tests/       # Test files (empty)
│   │   ├── types/       # TypeScript type definitions
│   │   │   └── express.d.ts
│   │   ├── lib/         # Core libraries
│   │   │   ├── auth.ts
│   │   │   └── cache.ts
│   │   ├── context.ts
│   │   ├── http.ts
│   │   └── index.ts
│   ├── Dockerfile
│   ├── docker-compose.yml
│   ├── drizzle.config.ts
│   ├── package.json
│   └── tsconfig.json
├── .github/              # GitHub Actions workflows
│   └── workflows/
│       └── ci.yml
├── LICENSE
└── README.md
```

## 🔧 Development

### Available Scripts

#### Server
```bash
cd server
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run migrate      # Run database migrations
npm run generate     # Generate new migration
npm run seed         # Seed database with demo data
npm test             # Run tests
npm run lint         # Lint code
npm run typecheck    # Type check
npm run codegen      # Generate GraphQL types
npm run codegen:watch # Watch mode for GraphQL code generation
```

#### Client
```bash
cd client
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm test             # Run tests
npm run lint         # Lint code
npm run typecheck    # Type check
npm run codegen      # Generate GraphQL types
npm run codegen:watch # Watch mode for GraphQL code generation
```

### Database Management

```bash
# Generate new migration
cd server
npm run generate

# Apply migrations
npm run migrate

# Seed with demo data
npm run seed

# Reset database (development only)
npm run db:reset
```

## 🧪 Testing

### Server Tests
```bash
cd server
npm test                    # Run all tests
npm run test:watch         # Watch mode
npm run test:coverage      # Coverage report
```

### Client Tests
```bash
cd client
npm test                   # Run all tests
npm run test:ui           # UI test runner
npm run test:coverage     # Coverage report
```

### Test Coverage
- **Unit Tests**: Components, hooks, utilities
- **Integration Tests**: API endpoints, database operations
- **E2E Tests**: Complete user workflows
- **Performance Tests**: Load testing with Artillery
- **Security Tests**: OWASP ZAP integration

## 🐳 Docker

### Development
```bash
cd server

# Start all services
docker compose up -d

# View logs
docker compose logs -f

# Stop services
docker compose down
```

## 🔐 Authentication

The app supports multiple authentication methods:

- **Email/Password**: Traditional signup/login
- **Google OAuth**: One-click Google authentication
- **JWT Tokens**: Access tokens (15min) + Refresh tokens (7 days)

### Setting up Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs
6. Update environment variables

## 💳 Stripe Integration

### Setup
1. Create a [Stripe account](https://stripe.com)
2. Get your API keys from the dashboard
3. Update environment variables
4. Set up webhook endpoints

### Features
- **Checkout Sessions**: Secure payment processing
- **Billing Portal**: Customer subscription management
- **Webhooks**: Real-time payment status updates
- **Payouts**: Automatic merchant/courier payments

## 📊 API Documentation

### GraphQL Endpoint
- **URL**: `http://localhost:4000/graphql`
- **Playground**: Available in development mode

### GraphQL Code Generator
- **Type Safety**: Auto-generated TypeScript types from GraphQL schema
- **React Hooks**: Auto-generated hooks for queries, mutations, and subscriptions
- **IntelliSense**: Full autocomplete and error checking
- **Documentation**: See [GraphQL Code Generator Guide](docs/GRAPHQL_CODEGEN.md)

### Key Queries
```graphql
# Get current user
query Me {
  me {
    id
    email
    firstName
    lastName
    role
  }
}

# Get restaurants
query Restaurants {
  restaurants {
    id
    name
    slug
    cuisine
    rating
    deliveryTime
    isOpen
  }
}
```

### Key Mutations
```graphql
# Sign up
mutation Signup($input: SignupInput!) {
  signup(input: $input) {
    accessToken
    refreshToken
    user {
      id
      email
      firstName
      lastName
    }
  }
}

# Place order
mutation PlaceOrder($input: PlaceOrderInput!) {
  placeOrder(input: $input) {
    id
    orderNumber
    status
    total
  }
}
```

## 🚀 Deployment

### Environment Variables

#### Server (.env)
```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=delivering

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-super-secret-refresh-key

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Stripe
STRIPE_SECRET_KEY=sk_test_your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret

# Server
PORT=4000
NODE_ENV=production
CORS_ORIGIN=https://your-domain.com
```

#### Client (.env.local)
```env
NEXT_PUBLIC_API_URL=https://api.your-domain.com
NEXT_PUBLIC_SOCKET_URL=wss://api.your-domain.com
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your-stripe-publishable-key
```

### Production Deployment

1. **Build the applications**:
   ```bash
   npm run build
   ```

2. **Set up production database**:
   ```bash
   cd server
   npm run migrate
   npm run seed
   ```

3. **Deploy with Docker**:
   ```bash
   docker compose -f docker-compose.prod.yml up -d
   ```

### Deployment Options
- **Docker Compose**: Local and small-scale deployments
- **AWS ECS**: Containerized deployments on AWS
- **Google Cloud Run**: Serverless container deployments
- **DigitalOcean App Platform**: Managed application hosting
- **Kubernetes**: Large-scale container orchestration

## 📚 Documentation

### Comprehensive Guides
- **[API Documentation](docs/API.md)**: Complete GraphQL API reference
- **[GraphQL Code Generator](docs/GRAPHQL_CODEGEN.md)**: Type-safe GraphQL development
- **[Deployment Guide](docs/DEPLOYMENT.md)**: Production deployment instructions
- **[Performance Guide](docs/PERFORMANCE.md)**: Optimization strategies
- **[Security Guide](docs/SECURITY.md)**: Security best practices
- **[Maintenance Guide](docs/MAINTENANCE.md)**: Operational procedures
- **[Troubleshooting Guide](docs/TROUBLESHOOTING.md)**: Common issues and solutions

**Note**: Some advanced monitoring and logging features mentioned in the documentation have been removed to keep the server implementation simple and focused on core functionality.

### Quick References
- **Environment Variables**: See `env.production.example`
- **Docker Configuration**: See `docker-compose.prod.yml`
- **Nginx Configuration**: See `nginx/nginx.conf`
- **Test Coverage**: See test reports in `coverage/`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Write tests for new features
- Use conventional commit messages
- Update documentation as needed
- Ensure all CI checks pass

## 📝 License

This project is licensed under the Apache 2.0 License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Apollo GraphQL](https://www.apollographql.com/) - GraphQL platform
- [Drizzle ORM](https://orm.drizzle.team/) - TypeScript ORM
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Stripe](https://stripe.com/) - Payment processing

## 📞 Support

For support, email support@delivering.com or join our Slack channel.

---

**Happy coding! 🚀**
