# Deploy Script for Crypto Trading App

## Prerequisites
- Git installed
- Docker and Docker Compose installed
- Node.js 18+ installed
- Go 1.21+ installed

## Development Setup

### 1. Clone the repository
```bash
git clone <repository-url>
cd crypto-app
```

### 2. Install dependencies
```bash
# Install all dependencies
npm install

# Install Go dependencies
cd apps/api && go mod tidy
```

### 3. Set up environment variables
```bash
# Copy environment files
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
```

### 4. Start development servers
```bash
# Start with Docker Compose
docker-compose up -d

# Or start individually
# Database
docker-compose up postgres -d

# Backend API
cd apps/api && go run main.go

# Frontend
cd apps/web && npm run dev
```

## Production Deployment

### 1. Build and deploy with Docker
```bash
# Build and start production containers
docker-compose -f docker-compose.prod.yml up -d --build
```

### 2. Environment Configuration
Make sure to set the following environment variables for production:
- `DATABASE_URL`: Production database connection string
- `JWT_SECRET`: Strong JWT secret key
- `NEXT_PUBLIC_API_URL`: Production API URL

### 3. SSL Configuration
Place SSL certificates in `infra/ssl/` directory:
- `cert.pem`: SSL certificate
- `key.pem`: SSL private key

Then uncomment the HTTPS server block in `infra/docker/nginx.prod.conf`

## API Endpoints

### Authentication
- `POST /api/register` - User registration
- `POST /api/login` - User login

### Trading
- `GET /api/coins` - Get all coins
- `POST /api/trades` - Create new trade
- `GET /api/trades` - Get user trades
- `GET /api/trades/history` - Get trade history

### User Management
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update user profile
- `GET /api/watchlist` - Get user watchlist
- `POST /api/watchlist` - Add coin to watchlist
- `DELETE /api/watchlist/:coinId` - Remove coin from watchlist

## Frontend Pages

- `/` - Landing page
- `/login` - User login
- `/register` - User registration
- `/dashboard` - User dashboard
- `/trade` - Trading interface

## Tech Stack

### Backend
- **Go Fiber**: Web framework
- **PostgreSQL**: Database
- **GORM**: ORM
- **JWT**: Authentication
- **bcrypt**: Password hashing

### Frontend
- **Next.js**: React framework
- **TypeScript**: Type safety
- **Tailwind CSS**: Styling
- **Axios**: HTTP client

### Infrastructure
- **Docker**: Containerization
- **Docker Compose**: Orchestration
- **Nginx**: Reverse proxy
- **Air**: Hot reload (development)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
