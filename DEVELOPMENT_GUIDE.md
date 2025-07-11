# 🚀 Hướng dẫn phát triển Crypto Trading App

## 📋 Mục lục
1. [Tổng quan dự án](#tổng-quan-dự-án)
2. [Kiến trúc hệ thống](#kiến-trúc-hệ-thống)
3. [Cài đặt môi trường](#cài-đặt-môi-trường)
4. [Hướng dẫn phát triển](#hướng-dẫn-phát-triển)
5. [Database Schema](#database-schema)
6. [API Documentation](#api-documentation)
7. [Frontend Architecture](#frontend-architecture)
8. [Deployment Guide](#deployment-guide)
9. [Troubleshooting](#troubleshooting)

---

## 🎯 Tổng quan dự án

### Mục tiêu
Xây dựng một ứng dụng giao dịch tiền điện tử hoàn chỉnh với:
- Giao diện người dùng hiện đại (Next.js)
- Backend API mạnh mẽ (GoFiber)
- Database PostgreSQL
- Authentication JWT
- Containerization Docker

### Tech Stack
- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS
- **Backend**: GoFiber (Go) + GORM
- **Database**: PostgreSQL 15
- **Authentication**: JWT + bcrypt
- **Deployment**: Docker + Docker Compose

---

## 🏗️ Kiến trúc hệ thống

```
crypto-app/
├── apps/
│   ├── web/                    # Frontend Next.js
│   │   ├── src/
│   │   │   ├── components/     # Reusable components
│   │   │   ├── pages/          # Next.js pages
│   │   │   ├── hooks/          # Custom React hooks
│   │   │   ├── services/       # API services
│   │   │   ├── types/          # TypeScript types
│   │   │   └── context/        # React Context
│   │   └── package.json
│   │
│   └── api/                    # Backend GoFiber
│       ├── cmd/                # Application entry point
│       ├── controllers/        # API controllers
│       ├── models/             # Database models
│       ├── middlewares/        # Custom middlewares
│       ├── routes/             # API routes
│       ├── database/           # Database connection
│       ├── utils/              # Utility functions
│       └── go.mod
│
├── infra/
│   ├── docker/                 # Docker configurations
│   └── db/                     # Database migrations
│
├── shared/                     # Shared types & constants
├── docker-compose.yml          # Development environment
└── docker-compose.prod.yml     # Production environment
```

---

## 🛠️ Cài đặt môi trường

### Yêu cầu hệ thống
- Node.js 18+
- Go 1.21+
- Docker & Docker Compose
- PostgreSQL 15+ (nếu chạy local)

### Cài đặt nhanh
```bash
# 1. Clone repository
git clone https://github.com/namtranst2304/crypto-trading-app.git
cd crypto-trading-app

# 2. Copy environment files
cp apps/web/.env.local.example apps/web/.env.local
cp apps/api/.env.example apps/api/.env

# 3. Start với Docker (Recommended)
docker-compose up -d

# 4. Hoặc chạy riêng lẻ
# Terminal 1: Database
docker-compose up postgres -d

# Terminal 2: Backend
cd apps/api
go mod tidy
go run cmd/main.go

# Terminal 3: Frontend
cd apps/web
npm install
npm run dev
```

### Truy cập ứng dụng
- Frontend: http://localhost:3000
- Backend API: http://localhost:8080
- Database: localhost:5432

---

## 🔧 Hướng dẫn phát triển

### Backend Development (GoFiber)

#### 1. Thêm API endpoint mới
```go
// 1. Tạo controller mới: apps/api/controllers/new_controller.go
func NewController(c *fiber.Ctx) error {
    // Logic xử lý
    return c.JSON(fiber.Map{
        "message": "Success",
        "data":    data,
    })
}

// 2. Thêm route: apps/api/routes/routes.go
func SetupRoutes(app *fiber.App) {
    api := app.Group("/api")
    
    // Existing routes...
    api.Get("/new-endpoint", controllers.NewController)
}
```

#### 2. Thêm Model mới
```go
// apps/api/models/new_model.go
type NewModel struct {
    ID        uint      `json:"id" gorm:"primaryKey"`
    Name      string    `json:"name" gorm:"not null"`
    CreatedAt time.Time `json:"created_at"`
    UpdatedAt time.Time `json:"updated_at"`
}

// Thêm vào AutoMigrate: apps/api/database/db.go
func ConnectDB() {
    // ... existing code
    
    database.AutoMigrate(
        &models.User{},
        &models.Coin{},
        &models.Trade{},
        &models.UserCoin{},
        &models.Watchlist{},
        &models.NewModel{}, // Thêm model mới
    )
}
```

#### 3. Middleware tùy chỉnh
```go
// apps/api/middlewares/custom_middleware.go
func CustomMiddleware() fiber.Handler {
    return func(c *fiber.Ctx) error {
        // Logic middleware
        return c.Next()
    }
}
```

### Frontend Development (Next.js)

#### 1. Thêm trang mới
```typescript
// apps/web/src/pages/new-page.tsx
import { NextPage } from 'next';
import { useAuth } from '@/hooks/useAuth';

const NewPage: NextPage = () => {
    const { user } = useAuth();
    
    return (
        <div>
            <h1>New Page</h1>
            {/* Component logic */}
        </div>
    );
};

export default NewPage;
```

#### 2. Tạo component mới
```typescript
// apps/web/src/components/NewComponent.tsx
interface NewComponentProps {
    title: string;
    data?: any;
}

export const NewComponent: React.FC<NewComponentProps> = ({ title, data }) => {
    return (
        <div className="card">
            <h2>{title}</h2>
            {/* Component UI */}
        </div>
    );
};
```

#### 3. Thêm API service
```typescript
// apps/web/src/services/new-service.ts
import { api } from './api';

export const newService = {
    getAll: async () => {
        const response = await api.get('/new-endpoint');
        return response.data;
    },
    
    create: async (data: any) => {
        const response = await api.post('/new-endpoint', data);
        return response.data;
    },
};
```

#### 4. Custom hook
```typescript
// apps/web/src/hooks/useNewData.tsx
import { useState, useEffect } from 'react';
import { newService } from '@/services/new-service';

export const useNewData = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await newService.getAll();
                setData(result);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return { data, loading, error };
};
```

---

## 🗄️ Database Schema

### Existing Tables

#### users
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    balance DECIMAL(20,8) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### coins
```sql
CREATE TABLE coins (
    id SERIAL PRIMARY KEY,
    symbol VARCHAR(10) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(20,8) NOT NULL,
    market_cap DECIMAL(20,2),
    volume_24h DECIMAL(20,2),
    change_24h DECIMAL(5,2),
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### trades
```sql
CREATE TABLE trades (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    coin_id INTEGER REFERENCES coins(id),
    type VARCHAR(4) CHECK (type IN ('buy', 'sell')),
    quantity DECIMAL(20,8) NOT NULL,
    price DECIMAL(20,8) NOT NULL,
    total DECIMAL(20,8) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### user_coins
```sql
CREATE TABLE user_coins (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    coin_id INTEGER REFERENCES coins(id),
    quantity DECIMAL(20,8) DEFAULT 0,
    average_price DECIMAL(20,8) DEFAULT 0,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, coin_id)
);
```

#### watchlists
```sql
CREATE TABLE watchlists (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    coin_id INTEGER REFERENCES coins(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, coin_id)
);
```

### Thêm bảng mới
```sql
-- apps/infra/db/migrations/new_table.sql
CREATE TABLE new_table (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 📡 API Documentation

### Authentication Endpoints

#### POST /api/register
```json
Request:
{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
}

Response:
{
    "message": "User created successfully",
    "user": {
        "id": 1,
        "username": "testuser",
        "email": "test@example.com"
    }
}
```

#### POST /api/login
```json
Request:
{
    "email": "test@example.com",
    "password": "password123"
}

Response:
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
        "id": 1,
        "username": "testuser",
        "email": "test@example.com"
    }
}
```

### Trading Endpoints

#### GET /api/coins
```json
Response:
[
    {
        "id": 1,
        "symbol": "BTC",
        "name": "Bitcoin",
        "price": 45000.00,
        "change_24h": 2.5
    }
]
```

#### POST /api/trades
```json
Request:
{
    "coin_id": 1,
    "type": "buy",
    "quantity": 0.1,
    "price": 45000.00
}

Response:
{
    "message": "Trade executed successfully",
    "trade": {
        "id": 1,
        "type": "buy",
        "quantity": 0.1,
        "total": 4500.00
    }
}
```

### User Management Endpoints

#### GET /api/profile
```json
Headers: Authorization: Bearer <token>

Response:
{
    "id": 1,
    "username": "testuser",
    "email": "test@example.com",
    "balance": 10000.00
}
```

#### GET /api/watchlist
```json
Headers: Authorization: Bearer <token>

Response:
[
    {
        "id": 1,
        "coin": {
            "symbol": "BTC",
            "name": "Bitcoin",
            "price": 45000.00
        }
    }
]
```

---

## 🎨 Frontend Architecture

### Component Structure
```
src/components/
├── ui/                 # Basic UI components
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Card.tsx
│   └── Table.tsx
├── forms/              # Form components
│   ├── LoginForm.tsx
│   └── RegisterForm.tsx
├── trading/            # Trading specific components
│   ├── CoinList.tsx
│   ├── TradingForm.tsx
│   └── TradeHistory.tsx
└── layout/             # Layout components
    ├── Header.tsx
    ├── Footer.tsx
    └── Sidebar.tsx
```

### State Management
```typescript
// Context API pattern
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Auth logic here

    return (
        <AuthContext.Provider value={{ user, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};
```

### Styling Guidelines
```css
/* Tailwind CSS Classes */
.btn {
    @apply inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors;
}

.btn-primary {
    @apply btn bg-primary text-primary-foreground hover:bg-primary/90;
}

.card {
    @apply rounded-lg border bg-card text-card-foreground shadow-sm;
}
```

---

## 🚀 Deployment Guide

### Development
```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# Rebuild and start
docker-compose up -d --build

# View logs
docker-compose logs -f [service_name]
```

### Production
```bash
# Build and deploy production
docker-compose -f docker-compose.prod.yml up -d --build

# Environment variables for production
export DATABASE_URL="postgres://user:pass@host:5432/dbname"
export JWT_SECRET="your-super-secret-production-key"
export NEXT_PUBLIC_API_URL="https://your-api-domain.com"
```

### SSL Configuration
```nginx
# infra/docker/nginx.prod.conf
server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;

    # Rest of configuration
}
```

---

## 🔧 Troubleshooting

### Common Issues

#### 1. Database Connection Error
```bash
# Check database status
docker-compose ps

# Check database logs
docker-compose logs postgres

# Reset database
docker-compose down -v
docker-compose up postgres -d
```

#### 2. Frontend Build Issues
```bash
# Clear next cache
rm -rf apps/web/.next

# Reinstall dependencies
cd apps/web
rm -rf node_modules package-lock.json
npm install
```

#### 3. Backend Module Issues
```bash
# Clean go modules
cd apps/api
go clean -modcache
go mod tidy
go mod download
```

#### 4. Port Conflicts
```bash
# Check ports in use
netstat -tulpn | grep :3000
netstat -tulpn | grep :8080

# Kill processes
sudo kill -9 <PID>
```

### Debug Commands
```bash
# Check all running containers
docker ps

# Enter container shell
docker exec -it crypto-app-api-1 /bin/bash

# Check container logs
docker logs crypto-app-api-1

# Check network connectivity
docker network ls
docker network inspect crypto-app_crypto-network
```

---

## 📝 Development Workflow

### 1. Feature Development
```bash
# 1. Create feature branch
git checkout -b feature/new-feature

# 2. Develop feature
# - Add backend endpoints
# - Create frontend components
# - Write tests

# 3. Test locally
docker-compose up -d
npm test

# 4. Commit changes
git add .
git commit -m "feat: add new feature"

# 5. Push and create PR
git push origin feature/new-feature
```

### 2. Code Standards
```typescript
// Use TypeScript interfaces
interface User {
    id: number;
    username: string;
    email: string;
}

// Use functional components
const MyComponent: React.FC<Props> = ({ prop1, prop2 }) => {
    return <div>{prop1}</div>;
};

// Use custom hooks
const useCustomHook = () => {
    const [state, setState] = useState(initialState);
    return { state, setState };
};
```

### 3. Testing
```bash
# Backend tests
cd apps/api
go test ./...

# Frontend tests
cd apps/web
npm test
npm run test:coverage
```

---

## 🎯 Roadmap & Features to Add

### Immediate Improvements
- [ ] Real-time price updates (WebSocket)
- [ ] Email verification
- [ ] Password reset functionality
- [ ] Two-factor authentication
- [ ] API rate limiting

### Advanced Features
- [ ] Cryptocurrency news integration
- [ ] Technical analysis charts
- [ ] Portfolio analytics
- [ ] Price alerts
- [ ] Mobile app (React Native)

### Infrastructure
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Monitoring & logging
- [ ] Error tracking (Sentry)
- [ ] Performance optimization
- [ ] Load balancing

---

## 📞 Support & Contact

### Repository
- GitHub: https://github.com/namtranst2304/crypto-trading-app
- Issues: https://github.com/namtranst2304/crypto-trading-app/issues

### Documentation
- README.md: Basic setup instructions
- DEPLOY.md: Deployment guide
- DEVELOPMENT_GUIDE.md: This file

### Development Tips
1. Always test changes locally before pushing
2. Use meaningful commit messages
3. Keep components small and focused
4. Write clean, readable code
5. Comment complex logic
6. Handle errors gracefully

---

**Happy Coding! 🚀**
