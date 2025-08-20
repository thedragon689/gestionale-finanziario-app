# 🏦 Gestionale Finanziario

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9.5-blue.svg)](https://www.typescriptlang.org/)
[![Material-UI](https://img.shields.io/badge/Material--UI-5.14.20-blue.svg)](https://mui.com/)
[![Docker](https://img.shields.io/badge/Docker-Compose-blue.svg)](https://www.docker.com/)

> **Modern Financial Management System** - A comprehensive web application for financial management: accounts, transactions, customers, cryptocurrencies, interactive reports, settings, stock RSS feeds, fund management, and insurance management.

## 🌟 Features

### 📊 Dashboard & Analytics
- **Real-time Dashboard**: Overview, trends, recent transactions, system status
- **Interactive Reports**: Line, bar, pie charts with Recharts
- **Performance Metrics**: Fund performance, portfolio analytics
- **System Monitoring**: Health checks and status indicators

### 💰 Financial Management
- **Account Management**: Multi-currency account tracking
- **Transaction Processing**: Comprehensive transaction history and filtering
- **Customer Management**: Client database with advanced filtering
- **Fund Management**: Equity, bond, and index fund tracking

### 🪙 Cryptocurrency Integration
- **Crypto Wallets**: Bitcoin and altcoin wallet management
- **Transaction History**: Complete crypto transaction tracking
- **Real-time Prices**: Live cryptocurrency price feeds
- **Portfolio Analytics**: Crypto investment performance

### 📰 Market Intelligence
- **RSS Stock Feeds**: Real-time financial news with categories
- **News Filtering**: Advanced filtering and bookmarking
- **Reading Status**: Track read/unread articles
- **Market Updates**: Live market data integration

### 🛡️ Insurance Management
- **Multi-line Insurance**: Auto, home/pet, life, pension
- **Document Management**: Policy documents and certificates
- **Claims Tracking**: Incident and claim management
- **Renewal Alerts**: Policy expiration notifications

## 🏗️ Architecture

### Frontend Stack
- **React 18** with TypeScript for type safety
- **Material-UI (MUI)** for professional UI components
- **Recharts** for interactive data visualization
- **React Router** for client-side routing
- **Axios** for HTTP client management

### Backend Services (Microservices)
- **API Gateway**: Centralized API management
- **Core Banking**: Account and transaction processing
- **Customer Management**: Client data and relationships
- **Investment Portfolio**: Fund and investment tracking
- **Cryptocurrency**: Crypto wallet and transaction services
- **Compliance & Audit**: Regulatory compliance tracking
- **Security & Access**: Authentication and authorization
- **Reporting & Analytics**: Business intelligence services

### Infrastructure
- **PostgreSQL**: Primary relational database
- **Redis**: Caching and session management
- **MongoDB**: Document storage for compliance
- **Docker Compose**: Containerized deployment
- **Nginx**: Reverse proxy and load balancing
- **Prometheus + Grafana**: Monitoring and observability

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm 9+
- Docker and Docker Compose (optional)
- Git

### Frontend Only (Development)
```bash
# Clone the repository
git clone https://github.com/your-username/gestionale-finanziario.git
cd gestionale-finanziario

# Install frontend dependencies
cd frontend
npm install

# Start development server
npm start
```

The application will be available at `http://localhost:3000`

### Full Stack (Production)
```bash
# Clone and setup
git clone https://github.com/your-username/gestionale-finanziario.git
cd gestionale-finanziario

# Run setup script
npm run setup

# Start all services
npm start
```

### Docker Deployment
```bash
# Start all services with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## ⚙️ Configuration

### Environment Variables
Create a `.env` file in the project root:

```env
# Database
DB_PASSWORD=your_secure_password
REDIS_PASSWORD=your_redis_password
MONGO_PASSWORD=your_mongo_password

# JWT
JWT_SECRET=your_jwt_secret_key

# Bitcoin Core (optional)
BITCOIN_RPC_URL=http://localhost:8332
BITCOIN_RPC_USER=bitcoin
BITCOIN_RPC_PASSWORD=your_bitcoin_password

# OpenAI (for AI features)
OPENAI_API_KEY=your_openai_api_key

# Grafana
GRAFANA_PASSWORD=your_grafana_password
```

### Frontend Configuration
Create a `.env` file in the `frontend` directory:

```env
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_ENVIRONMENT=development
```

## 📁 Project Structure

```
gestionale-finanziario/
├── frontend/                 # React TypeScript frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API service layer
│   │   ├── store/          # State management
│   │   └── utils/          # Utility functions
│   └── public/             # Static assets
├── core-banking/           # Core banking microservice
├── cryptocurrency/         # Cryptocurrency service
├── customer-management/    # Customer management service
├── investment-portfolio/   # Investment tracking service
├── compliance-audit/       # Compliance and audit service
├── security-access/        # Authentication service
├── reporting-analytics/    # Analytics service
├── docker-compose.yml      # Docker services configuration
├── scripts/               # Setup and utility scripts
└── docs/                  # Documentation
```

## 🛠️ Development

### Available Scripts
```bash
# Development
npm run dev              # Start all services in development
npm run dev:frontend     # Start frontend only
npm run dev:api          # Start API services only

# Building
npm run build            # Build all services
npm run build:frontend   # Build frontend for production
npm run build:api        # Build API services

# Testing
npm test                 # Run all tests
npm run test:frontend    # Run frontend tests
npm run test:api         # Run API tests

# Linting
npm run lint             # Lint all code
npm run lint:frontend    # Lint frontend code
npm run lint:api         # Lint API code

# Docker
npm start                # Start with Docker Compose
npm run stop             # Stop Docker services
npm run restart          # Restart Docker services
npm run logs             # View Docker logs
```

### Adding New Features
1. **Frontend**: Add components in `frontend/src/components/`
2. **Pages**: Create new pages in `frontend/src/pages/`
3. **Services**: Extend API services in `frontend/src/services/`
4. **Backend**: Add new microservices following the existing pattern

## 🔧 Customization

### Theming
Customize the Material-UI theme in `frontend/src/App.tsx`:

```typescript
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});
```

### Adding New Charts
Use Recharts components in your pages:

```typescript
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const data = [
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 300 },
  // ...
];

<LineChart width={600} height={300} data={data}>
  <CartesianGrid strokeDasharray="3 3" />
  <XAxis dataKey="name" />
  <YAxis />
  <Tooltip />
  <Line type="monotone" dataKey="value" stroke="#8884d8" />
</LineChart>
```

## 🧪 Testing

### Frontend Testing
```bash
cd frontend
npm test                 # Run tests in watch mode
npm run test:coverage    # Generate coverage report
```

### API Testing
```bash
cd core-banking
npm test                 # Run service tests
npm run test:integration # Run integration tests
```

## 📊 Monitoring

### Health Checks
- Frontend: `http://localhost:3000/health`
- API Gateway: `http://localhost:3001/health`
- Prometheus: `http://localhost:9090`
- Grafana: `http://localhost:3001` (admin/admin123)

### Logs
```bash
# View all logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f api-gateway
docker-compose logs -f frontend
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check the [docs/](docs/) folder
- **Issues**: Report bugs and feature requests via [GitHub Issues](https://github.com/your-username/gestionale-finanziario/issues)
- **Discussions**: Join the conversation in [GitHub Discussions](https://github.com/your-username/gestionale-finanziario/discussions)
- **Email**: support@gestionale-finanziario.com

## 🙏 Acknowledgments

- [Material-UI](https://mui.com/) for the beautiful UI components
- [Recharts](https://recharts.org/) for the interactive charts
- [React](https://reactjs.org/) for the amazing frontend framework
- [Docker](https://www.docker.com/) for containerization
- [PostgreSQL](https://www.postgresql.org/) for the robust database

## 📈 Roadmap

- [ ] **AI-Powered Insights**: Machine learning for financial recommendations
- [ ] **Mobile App**: React Native mobile application
- [ ] **Advanced Analytics**: Predictive analytics and forecasting
- [ ] **Multi-language Support**: Internationalization (i18n)
- [ ] **Real-time Notifications**: WebSocket-based alerts
- [ ] **API Documentation**: OpenAPI/Swagger documentation
- [ ] **Performance Optimization**: Advanced caching and optimization
- [ ] **Security Enhancements**: Advanced security features

---

**Made with ❤️ by the Gestionale Finanziario Team**

[![GitHub stars](https://img.shields.io/github/stars/your-username/gestionale-finanziario?style=social)](https://github.com/your-username/gestionale-finanziario/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/your-username/gestionale-finanziario?style=social)](https://github.com/your-username/gestionale-finanziario/network)
[![GitHub issues](https://img.shields.io/github/issues/your-username/gestionale-finanziario)](https://github.com/your-username/gestionale-finanziario/issues)
[![GitHub pull requests](https://img.shields.io/github/issues-pr/your-username/gestionale-finanziario)](https://github.com/your-username/gestionale-finanziario/pulls)

