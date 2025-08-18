# Order Management API

A modern, scalable REST API for managing customers and their orders, built with Node.js, TypeScript, Express, and Prisma.

## 🚀 Features

- **Complete CRUD Operations** for customers and orders
- **JWT Authentication** with secure route protection
- **Data Validation** using Zod schemas
- **Comprehensive API Documentation** with Swagger/OpenAPI
- **Pagination & Filtering** for list endpoints
- **Proper Error Handling** with consistent HTTP responses
- **Database Relations** with cascade delete support
- **TypeScript** for type safety
- **Clean Architecture** with service layer separation

## 🛠 Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT (jsonwebtoken)
- **Validation**: Zod
- **Documentation**: Swagger (swagger-jsdoc + swagger-ui-express)
- **Security**: Helmet, CORS
- **Logging**: Morgan

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Setup

Copy the example environment file:

```bash
cp .env.example .env
```

Update the `.env` file with your configuration:

```env
# Database
DATABASE_URL="your_db_url"

# JWT
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRES_IN="24h"

# Server
PORT=3000
NODE_ENV="development"

# Admin User (for seeding)
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="admin123"
```

### 3. Database Setup

Generate Prisma client and push schema to database:

```bash
npm run db:generate
npm run db:push
```

Seed the database with sample data:

```bash
npm run db:seed
```

### 4. Start Development Server

```bash
npm run dev
```

The API will be available at:
- **API Base URL**: http://localhost:3000
- **API Documentation**: http://localhost:3000/api-docs
- **Health Check**: http://localhost:3000/health

## 📚 API Documentation

### Authentication

All endpoints (except `/auth/login`) require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Getting Started

1. **Login** to get your JWT token:
   ```bash
   curl -X POST http://localhost:3000/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email": "admin@example.com", "password": "admin123"}'
   ```

2. **Use the token** in subsequent requests:
   ```bash
   curl -X GET http://localhost:3000/customers \
     -H "Authorization: Bearer <your-token>"
   ```

### Available Endpoints

#### Authentication
- `POST /auth/login` - Login and receive JWT token

#### Customers
- `POST /customers` - Create a customer
- `GET /customers` - List customers (with pagination)
- `GET /customers/:id` - Retrieve customer details
- `PUT /customers/:id` - Update customer info
- `DELETE /customers/:id` - Delete a customer

#### Orders
- `POST /orders` - Create an order for a customer
- `GET /orders` - List all orders (with filtering/pagination)
- `GET /orders/:id` - Retrieve order details
- `PUT /orders/:id` - Update an order
- `DELETE /orders/:id` - Delete an order

### Interactive Documentation

Visit http://localhost:3000/api-docs for the complete interactive Swagger documentation with:
- Detailed endpoint descriptions
- Request/response schemas
- Try-it-out functionality
- Authentication setup

## 🏗 Architecture

### Project Structure

```
src/
├── config/          # Configuration files (database, swagger)
├── controllers/     # Request handlers
├── middleware/      # Custom middleware (auth, validation, error handling)
├── routes/          # Route definitions
├── services/        # Business logic layer
├── types/           # TypeScript type definitions
├── utils/           # Utility functions (auth, validation, response)
└── app.ts          # Express app setup
└── index.ts        # Server entry point

prisma/
├── schema.prisma   # Database schema
└── seed.ts         # Database seeding script
```

### Key Design Patterns

- **Service Layer Pattern**: Business logic separated from controllers
- **Repository Pattern**: Data access abstracted through Prisma
- **Middleware Pattern**: Cross-cutting concerns (auth, validation, error handling)
- **Factory Pattern**: Consistent API response formatting

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt with salt rounds
- **Input Validation**: Comprehensive Zod schemas
- **Security Headers**: Helmet.js for security headers
- **CORS Protection**: Configurable CORS policies
- **Error Sanitization**: Production-safe error responses

## 📊 Database Schema

### Entities

- **Users**: Admin users for API access
- **Customers**: Customer information and contact details
- **Orders**: Order records with status tracking
- **OrderItems**: Individual items within orders

### Relationships

- Customer → Orders (One-to-Many)
- Order → OrderItems (One-to-Many)
- Cascade delete: Deleting a customer removes all associated orders

## 🧪 Testing the API

### Sample Requests

#### 1. Login
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@example.com", "password": "admin123"}'
```

#### 2. Create Customer
```bash
curl -X POST http://localhost:3000/customers \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "firstName": "Alice",
    "lastName": "Wilson",
    "email": "alice@example.com",
    "phone": "+1234567890",
    "address": "123 Main St, City, State 12345"
  }'
```

#### 3. Create Order
```bash
curl -X POST http://localhost:3000/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "customerId": "<customer-id>",
    "items": [
      {
        "productName": "Laptop",
        "quantity": 1,
        "unitPrice": 999.99
      }
    ],
    "notes": "Urgent delivery"
  }'
```

## 🚀 Production Deployment

### Environment Variables

For production, ensure you set:

```env
NODE_ENV="production"
JWT_SECRET="<strong-random-secret>"
DATABASE_URL="<production-database-url>"
```

### Database Migration

For PostgreSQL in production:

1. Update `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

2. Run migrations:
   ```bash
   npm run db:migrate
   ```

### Docker Support

The application is containerizable. Create a `Dockerfile`:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support or questions:
- Check the API documentation at `/api-docs`
- Review the health check endpoint at `/health`
- Open an issue in the repository

---

**Built with ❤️ using modern Node.js best practices**

---

## 🧪 API Testing Guide

### Postman Setup

#### 1. Environment Variables
Create a Postman environment with these variables:
```
base_url: http://localhost:3000
auth_token: (will be set after login)
```

#### 2. Authorization Setup
After login, set the `auth_token` variable and use it in request headers:
```
Authorization: Bearer {{auth_token}}
```

### 📋 Complete API Testing Examples

#### **Step 1: Authentication**

**Login Request**
```http
POST {{base_url}}/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "admin123"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "clq1234567890",
      "email": "admin@example.com",
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

**Postman Test Script:**
```javascript
// Save token to environment variable
if (pm.response.code === 200) {
    const response = pm.response.json();
    pm.environment.set("auth_token", response.data.token);
}
```

---

#### **Step 2: Customer Management**

**Create Customer**
```http
POST {{base_url}}/customers
Authorization: Bearer {{auth_token}}
Content-Type: application/json

{
  "firstName": "Alice",
  "lastName": "Johnson",
  "email": "alice.johnson@example.com",
  "phone": "+1234567890",
  "address": "123 Main Street, New York, NY 10001"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Customer created successfully",
  "data": {
    "id": "clq9876543210",
    "firstName": "Alice",
    "lastName": "Johnson",
    "email": "alice.johnson@example.com",
    "phone": "+1234567890",
    "address": "123 Main Street, New York, NY 10001",
    "createdAt": "2024-01-15T11:00:00.000Z",
    "updatedAt": "2024-01-15T11:00:00.000Z"
  }
}
```

**Postman Test Script:**
```javascript
// Save customer ID for future requests
if (pm.response.code === 201) {
    const response = pm.response.json();
    pm.environment.set("customer_id", response.data.id);
}
```

**List Customers with Pagination**
```http
GET {{base_url}}/customers?page=1&limit=5
Authorization: Bearer {{auth_token}}
```

**Get Customer by ID**
```http
GET {{base_url}}/customers/{{customer_id}}
Authorization: Bearer {{auth_token}}
```

**Update Customer**
```http
PUT {{base_url}}/customers/{{customer_id}}
Authorization: Bearer {{auth_token}}
Content-Type: application/json

{
  "firstName": "Alice",
  "lastName": "Smith",
  "phone": "+1987654321"
}
```

---

#### **Step 3: Order Management**

**Create Order**
```http
POST {{base_url}}/orders
Authorization: Bearer {{auth_token}}
Content-Type: application/json

{
  "customerId": "{{customer_id}}",
  "status": "PENDING",
  "notes": "Rush delivery requested",
  "items": [
    {
      "productName": "MacBook Pro 16-inch",
      "quantity": 1,
      "unitPrice": 2499.99
    },
    {
      "productName": "Magic Mouse",
      "quantity": 2,
      "unitPrice": 79.99
    }
  ]
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Order created successfully",
  "data": {
    "id": "clq5555555555",
    "orderNumber": "ORD-2024-000001",
    "status": "PENDING",
    "totalAmount": 2659.97,
    "notes": "Rush delivery requested",
    "customerId": "clq9876543210",
    "createdAt": "2024-01-15T11:30:00.000Z",
    "updatedAt": "2024-01-15T11:30:00.000Z",
    "customer": {
      "id": "clq9876543210",
      "firstName": "Alice",
      "lastName": "Johnson",
      "email": "alice.johnson@example.com"
    },
    "items": [
      {
        "id": "clq7777777777",
        "productName": "MacBook Pro 16-inch",
        "quantity": 1,
        "unitPrice": 2499.99,
        "totalPrice": 2499.99
      },
      {
        "id": "clq8888888888",
        "productName": "Magic Mouse",
        "quantity": 2,
        "unitPrice": 79.99,
        "totalPrice": 159.98
      }
    ]
  }
}
```

**Postman Test Script:**
```javascript
// Save order ID for future requests
if (pm.response.code === 201) {
    const response = pm.response.json();
    pm.environment.set("order_id", response.data.id);
}
```

**List Orders with Filtering**
```http
GET {{base_url}}/orders?page=1&limit=10&status=PENDING&customerId={{customer_id}}
Authorization: Bearer {{auth_token}}
```

**Get Order by ID**
```http
GET {{base_url}}/orders/{{order_id}}
Authorization: Bearer {{auth_token}}
```

**Update Order Status**
```http
PUT {{base_url}}/orders/{{order_id}}
Authorization: Bearer {{auth_token}}
Content-Type: application/json

{
  "status": "CONFIRMED",
  "notes": "Order confirmed and processing"
}
```

**Update Order with New Items**
```http
PUT {{base_url}}/orders/{{order_id}}
Authorization: Bearer {{auth_token}}
Content-Type: application/json

{
  "status": "PROCESSING",
  "items": [
    {
      "productName": "MacBook Pro 16-inch",
      "quantity": 1,
      "unitPrice": 2499.99
    },
    {
      "productName": "Magic Mouse",
      "quantity": 1,
      "unitPrice": 79.99
    },
    {
      "productName": "USB-C Cable",
      "quantity": 2,
      "unitPrice": 29.99
    }
  ]
}
```

---

### 🔧 **Postman Collection Setup**

#### **Pre-request Script (Collection Level)**
```javascript
// Automatically refresh token if expired
const token = pm.environment.get("auth_token");
if (!token) {
    console.log("No auth token found. Please login first.");
}
```

#### **Test Scripts for Common Validations**

**Success Response Test:**
```javascript
pm.test("Status code is success", function () {
    pm.expect(pm.response.code).to.be.oneOf([200, 201]);
});

pm.test("Response has success field", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData.success).to.be.true;
});

pm.test("Response has message", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData.message).to.be.a('string');
});
```

**Error Response Test:**
```javascript
pm.test("Error response format", function () {
    if (pm.response.code >= 400) {
        const jsonData = pm.response.json();
        pm.expect(jsonData.success).to.be.false;
        pm.expect(jsonData.message).to.be.a('string');
    }
});
```

---

### 🚨 **Error Testing Examples**

**Invalid Authentication**
```http
GET {{base_url}}/customers
Authorization: Bearer invalid_token
```

**Expected Response:**
```json
{
  "success": false,
  "message": "Invalid or expired token"
}
```

**Validation Error**
```http
POST {{base_url}}/customers
Authorization: Bearer {{auth_token}}
Content-Type: application/json

{
  "firstName": "",
  "email": "invalid-email"
}
```

**Expected Response:**
```json
{
  "success": false,
  "message": "Validation failed",
  "error": "firstName: String must contain at least 1 character(s), email: Invalid email format"
}
```

**Resource Not Found**
```http
GET {{base_url}}/customers/invalid-id
Authorization: Bearer {{auth_token}}
```

**Expected Response:**
```json
{
  "success": false,
  "message": "Customer not found"
}
```

---

### 📊 **Testing Workflow**

#### **Complete Test Sequence:**
1. **Login** → Save token
2. **Create Customer** → Save customer ID
3. **List Customers** → Verify pagination
4. **Get Customer** → Verify details
5. **Create Order** → Save order ID
6. **List Orders** → Test filtering
7. **Update Order** → Change status
8. **Get Order** → Verify changes
9. **Delete Order** → Test deletion
10. **Delete Customer** → Test cascade delete

#### **Postman Runner Configuration:**
- Set up environment variables
- Run collection with proper delays between requests
- Use data files for bulk testing
- Generate reports for test results

This comprehensive testing guide covers all endpoints with realistic examples and proper error handling scenarios!
