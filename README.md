# EasyClaims

A professional insurance claims management platform with separate public and admin interfaces.

## Features

### Public Site
- **Informational Pages**: Home, About, Services, FAQ, Contact, Privacy, Terms
- **No Data Collection**: Contact page provides only communication links (phone, WhatsApp, email)
- **Mobile-Friendly**: Responsive design for all devices
- **SEO Optimized**: Proper meta tags, semantic HTML, and robots.txt

### Admin Portal  
- **Secure Login**: Email/password authentication with token storage
- **Customer Search**: Search by ID, phone, or name with 300ms debouncing
- **Customer Details**: View customer information and all associated policies
- **Private Routes**: Admin pages are not linked in public navigation

## Environment Setup

1. Copy the environment template:
```bash
cp .env.example .env
```

2. Configure environment variables:
```bash
# API Configuration
VITE_API_BASE_URL=https://api.easyclaims.in

# Mock Mode
VITE_USE_MOCKS=true  # Use "true" for development, "false" for production
```

## Mock Mode

The application supports two modes:

### Development Mode (Mock Data)
Set `VITE_USE_MOCKS=true` to use hardcoded mock data:
- Login accepts any email/password combination
- Returns sample customer and policy data
- Perfect for development and testing

### Production Mode (Live API)
Set `VITE_USE_MOCKS=false` to use live API endpoints:
- `POST /auth/login` - Authentication
- `GET /customers/search?by=id|phone|name&q=...` - Customer search  
- `GET /customers/:id/policies` - Customer policies

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## API Integration

When `VITE_USE_MOCKS=false`, the application expects these API endpoints:

### Authentication
```
POST /auth/login
Content-Type: application/json

{
  "email": "admin@easyclaims.in",
  "password": "password"
}

Response: { "token": "jwt-token-here" }
```

### Customer Search
```
GET /customers/search?by=id|phone|name&q=search-query
Authorization: Bearer <token>

Response: [
  {
    "id": "customer-id",
    "name": "Customer Name", 
    "email": "customer@email.com",
    "phone": "+91-9876543210",
    "createdAt": "2024-01-15"
  }
]
```

### Customer Policies
```
GET /customers/:id/policies
Authorization: Bearer <token>

Response: [
  {
    "id": "policy-id",
    "policyNumber": "POL-2024-001",
    "type": "Health Insurance",
    "premium": 25000,
    "status": "Active",
    "startDate": "2024-01-01", 
    "endDate": "2024-12-31"
  }
]
```

## Security Features

- **Private Admin Routes**: Admin pages are not accessible via public navigation
- **Authentication Required**: All admin features require valid token
- **SEO Protection**: `robots.txt` disallows admin routes, `noindex` on admin pages
- **Token Management**: Secure token storage and automatic logout

## Tech Stack

- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Shadcn/ui** components
- **Lucide React** icons

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Shadcn/ui components
│   └── layout/         # Layout components (Header, Footer)
├── pages/              # Page components
│   ├── admin/          # Admin portal pages
│   └── *.tsx           # Public pages
├── lib/                # Utilities and configuration
│   ├── api.ts          # API client and mock data
│   ├── auth.ts         # Authentication utilities
│   └── env.ts          # Environment configuration
└── hooks/              # Custom React hooks
```

## License

© 2024 EasyClaims. All rights reserved.