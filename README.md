# Employee Management System

## Overview

The **Employee Management System** is a secure RESTful Web API built with **ASP.NET Core 8** that enables organizations to manage employees, departments, and user accounts.

The application implements **JWT Authentication** and **Role-Based Authorization**, ensuring that only authorized users can access protected resources. It demonstrates modern backend development practices, including secure authentication, database management, API documentation, validation, and exception handling.

---

## Features

- JWT Authentication
- Role-Based Authorization (Admin and HR)
- Employee CRUD Operations
- Department Management
- Search and Filtering using LINQ
- Pagination
- Data Validation
- Global Exception Handling
- Swagger/OpenAPI Documentation
- Entity Framework Core Code-First Migrations

---

## Technologies Used

| Technology | Purpose |
|------------|---------|
| C# | Programming Language |
| ASP.NET Core 8 | Web API Framework |
| Entity Framework Core | Object-Relational Mapper (ORM) |
| SQL Server | Relational Database |
| LINQ | Data Querying |
| JWT | Authentication |
| Swagger/OpenAPI | API Documentation |
| Git | Version Control |
| GitHub | Source Code Hosting |

---

## Project Structure

```text
EmployeeManagementSystem/
│
├── EmployeeManagement.API/
│   ├── Controllers/
│   ├── DTOs/
│   ├── Models/
│   ├── Data/
│   ├── Repositories/
│   ├── Services/
│   ├── Authentication/
│   ├── Middleware/
│   ├── Helpers/
│   ├── Migrations/
│   ├── Program.cs
│   └── appsettings.json
│
├── EmployeeManagement.Tests/
│
├── EmployeeManagement.sln
└── README.md
```

---

## Database Design

### Users

| Field |
|-------|
| Id |
| Username |
| Email |
| PasswordHash |
| Role |
| CreatedAt |

### Departments

| Field |
|-------|
| DepartmentId |
| DepartmentName |
| Description |

### Employees

| Field |
|-------|
| EmployeeId |
| FirstName |
| LastName |
| Email |
| Phone |
| Gender |
| Salary |
| Position |
| HireDate |
| DepartmentId |

### Relationship

```text
Department (1)
      │
      │
      └──────────< Employee (Many)
```

---

## Functional Modules

### Authentication

- User Registration
- User Login
- Password Hashing
- JWT Token Generation
- Secure API Access

### Employee Management

- Create Employee
- Retrieve Employee Details
- Update Employee Information
- Delete Employee

### Department Management

- Create Department
- Update Department
- Delete Department
- Retrieve Employees by Department

### Authorization

#### Administrator

Permissions:

- Manage Users
- Manage Employees
- Manage Departments
- Assign Roles

#### Human Resources (HR)

Permissions:

- View Employees
- Create Employees
- Update Employees

Restrictions:

- Cannot Manage Users
- Cannot Assign Roles
- Cannot Delete User Accounts

---

## Search

The API supports searching employees using LINQ.

Examples:

```http
GET /api/employees/search?name=john
```

Search criteria include:

- Name
- Email
- Department
- Position

---

## Filtering

Examples:

```http
GET /api/employees?department=IT

GET /api/employees?salary=50000

GET /api/employees?gender=Female
```

---

## Pagination

Example:

```http
GET /api/employees?page=1&pageSize=10
```

Sample Response:

```json
{
  "currentPage": 1,
  "pageSize": 10,
  "totalPages": 5,
  "totalRecords": 50,
  "data": []
}
```

---

## Validation

The project uses **Data Annotations** for input validation.

Example:

```csharp
[Required]
[StringLength(50)]
public string FirstName { get; set; }
```

Validation includes:

- Required Fields
- Email Format
- Phone Number
- Salary Range
- String Length

---

## Exception Handling

A global exception handling middleware provides consistent API responses for errors.

Handled Exceptions:

- Bad Request
- Validation Errors
- Unauthorized Access
- Forbidden Access
- Resource Not Found
- Internal Server Error

Example Response:

```json
{
    "status": 404,
    "message": "Employee not found"
}
```

---

## API Endpoints

### Authentication

| Method | Endpoint |
|---------|----------|
| POST | /api/auth/register |
| POST | /api/auth/login |

### Employees

| Method | Endpoint |
|---------|----------|
| GET | /api/employees |
| GET | /api/employees/{id} |
| POST | /api/employees |
| PUT | /api/employees/{id} |
| DELETE | /api/employees/{id} |

### Departments

| Method | Endpoint |
|---------|----------|
| GET | /api/departments |
| GET | /api/departments/{id} |
| POST | /api/departments |
| PUT | /api/departments/{id} |
| DELETE | /api/departments/{id} |

---

## Authentication Flow

```text
User
  │
  ▼
Login
  │
  ▼
Validate Credentials
  │
  ▼
Generate JWT Token
  │
  ▼
Return Token
  │
  ▼
Client Stores Token
  │
  ▼
Authorization Header
  │
  ▼
Protected API Endpoints
```

---

## Entity Relationship Diagram

```text
Department
-----------
DepartmentId
DepartmentName
      │
      │
      │
      ▼
Employees
-----------
EmployeeId
FirstName
LastName
DepartmentId
```

---

## Security

The application implements the following security measures:

- JWT Authentication
- Password Hashing
- Role-Based Authorization
- HTTPS
- Secure API Endpoints
- Input Validation

---

## Installation

### Clone the Repository

```bash
git clone https://github.com/yourusername/employee-management-system.git
```

### Navigate to the Project Directory

```bash
cd employee-management-system
```

### Restore Dependencies

```bash
dotnet restore
```

### Apply Database Migrations

```bash
dotnet ef database update
```

### Run the Application

```bash
dotnet run
```

### Open Swagger

```
https://localhost:5001/swagger
```

---

## Required NuGet Packages

```text
Microsoft.EntityFrameworkCore.SqlServer
Microsoft.EntityFrameworkCore.Tools
Microsoft.EntityFrameworkCore.Design
Microsoft.AspNetCore.Authentication.JwtBearer
Microsoft.IdentityModel.Tokens
Swashbuckle.AspNetCore
BCrypt.Net-Next
AutoMapper.Extensions.Microsoft.DependencyInjection
```

---

## Learning Outcomes

This project demonstrates proficiency in:

- RESTful API Development
- ASP.NET Core 8
- Entity Framework Core
- SQL Server
- LINQ Queries
- JWT Authentication
- Role-Based Authorization
- Middleware Development
- Global Exception Handling
- Data Validation
- Swagger/OpenAPI Documentation
- Git and GitHub
- Database Migrations

---

## Project Roadmap

### Phase 1: Project Setup

- Create ASP.NET Core Web API
- Configure SQL Server
- Install Required Packages
- Configure Entity Framework Core
- Initialize Git Repository

### Phase 2: Database Design

- Create Entities
- Configure Relationships
- Apply Migrations
- Seed Initial Data

### Phase 3: Authentication

- User Registration
- Login
- Password Hashing
- JWT Authentication
- Role Management

### Phase 4: Department Module

- CRUD Operations
- Validation
- Repository Pattern

### Phase 5: Employee Module

- CRUD Operations
- DTOs
- AutoMapper
- Department Relationships

### Phase 6: Advanced Features

- Search
- Filtering
- Sorting
- Pagination
- Global Exception Handling

### Phase 7: Testing and Documentation

- Swagger Documentation
- Postman Testing
- Final Documentation
- GitHub Repository Preparation

---

## Future Improvements

Potential enhancements include:

- Refresh Tokens
- Soft Delete
- Audit Logging
- Employee Profile Photos
- Leave Management
- Attendance Tracking
- Payroll Module
- Unit Testing
- Docker Support
- Redis Caching
- CI/CD Pipeline
- Azure Deployment
- Email Notifications

---

## License

This project is intended for educational and portfolio purposes.
