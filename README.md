# 👔 Employee Management System

> A secure, modern RESTful API for comprehensive employee and department management with JWT authentication and role-based authorization.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![ASP.NET Core](https://img.shields.io/badge/ASP.NET_Core-8-blue.svg)](https://dotnet.microsoft.com/)
[![SQL Server](https://img.shields.io/badge/Database-SQL_Server-red.svg)](https://www.microsoft.com/en-us/sql-server)
[![API](https://img.shields.io/badge/API-REST-green.svg)](https://restfulapi.net/)

---

## Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Quick Start](#-quick-start)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Database Design](#-database-design)
- [API Endpoints](#-api-endpoints)
- [Authentication Flow](#-authentication-flow)
- [Security](#-security)
- [Installation](#-installation)
- [NuGet Packages](#-required-nuget-packages)
- [Functional Modules](#-functional-modules)
- [Advanced Features](#-advanced-features)
- [Learning Outcomes](#-learning-outcomes)
- [Roadmap](#-project-roadmap)
- [Future Improvements](#-future-improvements)
- [License](#-license)
- [Support](#-support)

---

## 📋 Overview

A professional-grade **Employee Management System** built with **ASP.NET Core 8** and **SQL Server**. This application demonstrates modern backend development practices including:

✅ Secure JWT Authentication  
✅ Role-Based Access Control  
✅ Comprehensive CRUD Operations  
✅ Advanced Search & Filtering  
✅ Global Exception Handling  
✅ Swagger Documentation  

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔐 **JWT Authentication** | Secure token-based user authentication |
| 👥 **Role-Based Authorization** | Admin and HR role-based access control |
| 👨‍💼 **Employee Management** | Complete CRUD operations for employees |
| 🏢 **Department Management** | Manage company departments and structure |
| 🔍 **Search & Filter** | Advanced searching using LINQ queries |
| 📄 **Pagination** | Efficient data retrieval with pagination |
| ✔️ **Data Validation** | Comprehensive input validation |
| 🛡️ **Exception Handling** | Global middleware for error handling |
| 📚 **API Documentation** | Interactive Swagger/OpenAPI docs |
| 🔄 **Code-First Migrations** | Entity Framework Core migrations |

---

## 🚀 Quick Start

### Prerequisites

```
✓ .NET 8 SDK or higher
✓ SQL Server (Local or Remote)
✓ Visual Studio 2022 or VS Code
✓ Postman (for API testing)
```

### Installation

**Step 1:** Clone the repository
```bash
git clone https://github.com/Sheeba193/Employee-mngt.git
cd Employee-mngt
```

**Step 2:** Restore NuGet packages
```bash
dotnet restore
```

**Step 3:** Update database connection
Edit `appsettings.json`:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=YOUR_SERVER;Database=EmployeeManagementDB;Trusted_Connection=true;"
  }
}
```

**Step 4:** Apply migrations
```bash
dotnet ef database update
```

**Step 5:** Run the application
```bash
dotnet run
```

**Step 6:** Access Swagger UI
```
https://localhost:5001/swagger
```

---

## 🛠️ Tech Stack

### Core Technologies

| Category | Technology | Version |
|----------|-----------|---------|
| **Framework** | ASP.NET Core | 8.0 |
| **Language** | C# | Latest |
| **Database** | SQL Server | 2019+ |
| **ORM** | Entity Framework Core | 8.0 |
| **Authentication** | JWT Bearer | Standard |
| **API Docs** | Swagger/OpenAPI | 6.0+ |

### Key Libraries

```csharp
// Authentication & Security
Microsoft.AspNetCore.Authentication.JwtBearer
Microsoft.IdentityModel.Tokens
BCrypt.Net-Next

// Database
Microsoft.EntityFrameworkCore.SqlServer
Microsoft.EntityFrameworkCore.Tools
Microsoft.EntityFrameworkCore.Design

// API Documentation
Swashbuckle.AspNetCore

// Utilities
AutoMapper.Extensions.Microsoft.DependencyInjection
```

---

## 📁 Project Structure

```
EmployeeManagementSystem/
│
├── EmployeeManagement.API/
│   ├── Controllers/              # API endpoints
│   │   ├── AuthController.cs
│   │   ├── EmployeeController.cs
│   │   └── DepartmentController.cs
│   │
│   ├── Models/                  # Entity models
│   │   ├── User.cs
│   │   ├── Employee.cs
│   │   └── Department.cs
│   │
│   ├── DTOs/                    # Data transfer objects
│   │   ├── LoginRequest.cs
│   │   ├── EmployeeDto.cs
│   │   └── DepartmentDto.cs
│   │
│   ├── Data/                    # Database context
│   │   └── ApplicationDbContext.cs
│   │
│   ├── Repositories/            # Data access layer
│   │   ├── IEmployeeRepository.cs
│   │   └── EmployeeRepository.cs
│   │
│   ├── Services/                # Business logic
│   │   ├── IAuthService.cs
│   │   └── AuthService.cs
│   │
│   ├── Authentication/          # JWT handlers
│   │   └── JwtTokenGenerator.cs
│   │
│   ├── Middleware/              # Custom middleware
│   │   └── ExceptionHandlingMiddleware.cs
│   │
│   ├── Migrations/              # EF Core migrations
│   │
│   ├── appsettings.json         # Configuration
│   ├── Program.cs               # Startup configuration
│   └── Startup.cs
│
├── EmployeeManagement.Tests/    # Unit tests
│
├── EmployeeManagement.sln       # Solution file
└── README.md
```

---

## 💾 Database Design

### Users Table
```sql
[Users]
├── Id (PK)
├── Username (Unique)
├── Email (Unique)
├── PasswordHash
├── Role (Admin/HR)
└── CreatedAt
```

### Departments Table
```sql
[Departments]
├── DepartmentId (PK)
├── DepartmentName
└── Description
```

### Employees Table
```sql
[Employees]
├── EmployeeId (PK)
├── FirstName
├── LastName
├── Email
├── Phone
├── Gender
├── Salary
├── Position
├── HireDate
└── DepartmentId (FK) → Departments
```

### Entity Relationship

```
Department (1)
    │
    │ 1:Many
    │
    └──────────> Employee (Many)
```

---

## 📊 API Endpoints

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---|
| POST | `/api/auth/register` | Register new user | ❌ No |
| POST | `/api/auth/login` | Login & get JWT token | ❌ No |

### Employee Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---|
| GET | `/api/employees` | Get all employees | ✅ Yes |
| GET | `/api/employees/{id}` | Get employee by ID | ✅ Yes |
| POST | `/api/employees` | Create new employee | ✅ Yes (HR/Admin) |
| PUT | `/api/employees/{id}` | Update employee | ✅ Yes (HR/Admin) |
| DELETE | `/api/employees/{id}` | Delete employee | ✅ Yes (Admin Only) |
| GET | `/api/employees/search?name=john` | Search employees | ✅ Yes |

### Department Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---|
| GET | `/api/departments` | Get all departments | ✅ Yes |
| GET | `/api/departments/{id}` | Get department by ID | ✅ Yes |
| POST | `/api/departments` | Create department | ✅ Yes (Admin Only) |
| PUT | `/api/departments/{id}` | Update department | ✅ Yes (Admin Only) |
| DELETE | `/api/departments/{id}` | Delete department | ✅ Yes (Admin Only) |

---

## 🔍 Search & Filtering

### Search Example

**Search by Name:**
```http
GET /api/employees/search?name=john
```

**Search Criteria:**
- Name (FirstName, LastName)
- Email address
- Department
- Position

### Filtering Examples

**Filter by Department:**
```http
GET /api/employees?department=IT
```

**Filter by Salary:**
```http
GET /api/employees?salary=50000
```

**Filter by Gender:**
```http
GET /api/employees?gender=Female
```

---

## 📄 Pagination

### Request
```http
GET /api/employees?page=1&pageSize=10
```

### Response
```json
{
  "currentPage": 1,
  "pageSize": 10,
  "totalPages": 5,
  "totalRecords": 50,
  "data": [
    {
      "employeeId": 1,
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "department": "IT",
      "salary": 75000
    }
  ]
}
```

---

## 🔐 Authentication Flow

```
┌─────────────────────────────────────────┐
│           Authentication Flow           │
└─────────────────────────────────────────┘
         │
         ▼
    ┌─────────┐
    │  Login  │
    └────┬────┘
         │
         ▼
  ┌──────────────────┐
  │ Validate         │
  │ Credentials      │
  └────┬─────────────┘
       │
       ▼
  ┌──────────────────┐
  │ Generate         │
  │ JWT Token        │
  └────┬─────────────┘
       │
       ▼
  ┌──────────────────┐
  │ Return Token     │
  │ to Client        │
  └────┬─────────────┘
       │
       ▼
  ┌──────────────────┐
  │ Client Stores    │
  │ Token            │
  └────┬─────────────┘
       │
       ▼
  ┌──────────────────┐
  │ Include Token in │
  │ Authorization    │
  │ Header           │
  └────┬─────────────┘
       │
       ▼
  ┌──────────────────┐
  │ Access           │
  │ Protected        │
  │ Endpoints        │
  └──────────────────┘
```

---

## 👥 Authorization & Roles

### Administrator Role

**Permissions:**
- ✅ Manage all users
- ✅ Manage all employees
- ✅ Manage all departments
- ✅ Assign roles to users
- ✅ Delete user accounts
- ✅ Full system access

### Human Resources (HR) Role

**Permissions:**
- ✅ View all employees
- ✅ Create new employees
- ✅ Update employee information
- ✅ Generate reports
- ✅ View departments

**Restrictions:**
- ❌ Cannot manage users
- ❌ Cannot assign roles
- ❌ Cannot delete employees permanently
- ❌ Cannot delete users
- ❌ Limited admin functions

---

## ✔️ Data Validation

### Validation Rules

**Employee Validation:**
```csharp
[Required(ErrorMessage = "First name is required")]
[StringLength(50, MinimumLength = 2)]
public string FirstName { get; set; }

[EmailAddress(ErrorMessage = "Invalid email")]
public string Email { get; set; }

[Range(0, 10000000, ErrorMessage = "Invalid salary")]
public decimal Salary { get; set; }

[Phone(ErrorMessage = "Invalid phone number")]
public string Phone { get; set; }
```

**Validation Criteria:**
- Required fields validation
- Email format validation
- Phone number format
- Salary range validation
- String length constraints
- Date validations

### Error Response
```json
{
  "status": 400,
  "message": "Validation failed",
  "errors": {
    "email": ["Invalid email format"],
    "salary": ["Salary must be positive"]
  }
}
```

---

## 🛡️ Exception Handling

### Global Exception Middleware

Handles all exceptions consistently:

| Exception Type | HTTP Status | Response |
|---|---|---|
| Bad Request | 400 | Invalid request data |
| Unauthorized | 401 | Invalid credentials |
| Forbidden | 403 | Access denied |
| Not Found | 404 | Resource not found |
| Conflict | 409 | Duplicate data |
| Server Error | 500 | Internal server error |

### Exception Response Format
```json
{
  "status": 404,
  "message": "Employee not found",
  "timestamp": "2024-01-10T10:30:00Z"
}
```

---

## 🔒 Security

### Authentication & Authorization
- ✅ JWT token-based authentication
- ✅ Secure password hashing (BCrypt)
- ✅ Role-based access control (RBAC)
- ✅ Token expiration & refresh

### Data Protection
- ✅ HTTPS enforcement in production
- ✅ SQL injection prevention (parameterized queries)
- ✅ Input validation & sanitization
- ✅ CORS configuration
- ✅ Sensitive data encryption

### API Security
- ✅ Rate limiting (recommended)
- ✅ CSRF protection
- ✅ Secure headers
- ✅ Endpoint authorization
- ✅ Audit logging

---

## 📋 Required NuGet Packages

```bash
# Entity Framework
dotnet add package Microsoft.EntityFrameworkCore.SqlServer
dotnet add package Microsoft.EntityFrameworkCore.Tools
dotnet add package Microsoft.EntityFrameworkCore.Design

# Authentication
dotnet add package Microsoft.AspNetCore.Authentication.JwtBearer
dotnet add package Microsoft.IdentityModel.Tokens

# API Documentation
dotnet add package Swashbuckle.AspNetCore

# Security
dotnet add package BCrypt.Net-Next

# Mapping
dotnet add package AutoMapper.Extensions.Microsoft.DependencyInjection
```

---

## 🎓 Learning Outcomes

This project demonstrates expertise in:

| Topic | Skill Level |
|-------|------------|
| RESTful API Development | Advanced |
| ASP.NET Core 8 | Advanced |
| Entity Framework Core | Advanced |
| SQL Server | Intermediate |
| LINQ Queries | Advanced |
| JWT Authentication | Advanced |
| Role-Based Authorization | Advanced |
| Middleware Development | Intermediate |
| Global Exception Handling | Advanced |
| Data Validation | Advanced |
| Swagger/OpenAPI | Intermediate |
| Git & GitHub | Intermediate |
| Database Migrations | Advanced |

---

## 🗺️ Project Roadmap

### Phase 1: Setup ✅
- [x] ASP.NET Core Web API project
- [x] SQL Server configuration
- [x] NuGet dependencies installation
- [x] Entity Framework Core setup
- [x] Git repository initialization

### Phase 2: Database Design ✅
- [x] Entity model creation
- [x] Relationship configuration
- [x] Database migrations
- [x] Initial data seeding

### Phase 3: Authentication ✅
- [x] User registration endpoint
- [x] User login endpoint
- [x] Password hashing implementation
- [x] JWT token generation
- [x] Role management

### Phase 4: Department Module ✅
- [x] CRUD operations
- [x] Data validation
- [x] Repository pattern implementation

### Phase 5: Employee Module ✅
- [x] CRUD operations
- [x] DTO implementation
- [x] AutoMapper configuration
- [x] Department relationships

### Phase 6: Advanced Features ✅
- [x] Search functionality
- [x] Filtering capabilities
- [x] Sorting options
- [x] Pagination implementation
- [x] Global exception handling

### Phase 7: Documentation ✅
- [x] Swagger/OpenAPI documentation
- [x] API endpoint documentation
- [x] GitHub repository setup

---

## 🚀 Future Improvements

### High Priority
- [ ] Refresh token implementation
- [ ] Soft delete functionality
- [ ] Audit logging system
- [ ] Email notifications

### Medium Priority
- [ ] Employee profile photos
- [ ] Leave management module
- [ ] Attendance tracking
- [ ] Unit testing suite
- [ ] Redis caching layer

### Nice to Have
- [ ] Payroll module
- [ ] Docker support
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Azure deployment
- [ ] Advanced reporting dashboard
- [ ] Employee self-service portal

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

**Usage:** Educational and portfolio purposes.

---

## 💬 Support

### Getting Help

**GitHub Issues:**
- Report bugs: [Create an Issue](https://github.com/Sheeba193/Employee-mngt/issues)
- Feature requests: [Open a Discussion](https://github.com/Sheeba193/Employee-mngt/discussions)

### Troubleshooting

**Database Connection Issues:**
```bash
# Check connection string in appsettings.json
# Verify SQL Server is running
# Test connection: dotnet ef database update
```

**JWT Token Issues:**
```bash
# Verify token is in Authorization header
# Check token expiration
# Ensure correct role permissions
```

**Migration Issues:**
```bash
# Remove failed migration
dotnet ef migrations remove

# Re-apply migrations
dotnet ef database update
```

---

<div align="center">

**Built with ❤️ for professional employee management**

*Last updated: August 29, 2026*

[Report an Issue](https://github.com/Sheeba193/Employee-mngt/issues) | [View Code](https://github.com/Sheeba193/Employee-mngt) | [Discussions](https://github.com/Sheeba193/Employee-mngt/discussions)

</div>
