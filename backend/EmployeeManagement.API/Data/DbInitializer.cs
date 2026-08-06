using EmployeeManagement.API.Helpers;
using EmployeeManagement.API.Models;

namespace EmployeeManagement.API.Data;

public static class DbInitializer
{
    public static void Initialize(ApplicationDbContext context)
    {
        context.Database.EnsureCreated();

        if (context.Departments.Any())
        {
            return;
        }

        var departments = new[]
        {
            new Department { DepartmentName = "IT", Description = "Information Technology" },
            new Department { DepartmentName = "HR", Description = "Human Resources" },
            new Department { DepartmentName = "Finance", Description = "Finance and Accounting" }
        };

        context.Departments.AddRange(departments);
        context.SaveChanges();

        var employees = new[]
        {
            new Employee { FirstName = "John", LastName = "Doe", Email = "john.doe@example.com", Phone = "555-0101", Gender = "Male", Salary = 75000, Position = "Software Engineer", HireDate = new DateTime(2022, 1, 15), DepartmentId = departments[0].DepartmentId },
            new Employee { FirstName = "Jane", LastName = "Smith", Email = "jane.smith@example.com", Phone = "555-0102", Gender = "Female", Salary = 68000, Position = "HR Specialist", HireDate = new DateTime(2021, 6, 20), DepartmentId = departments[1].DepartmentId },
            new Employee { FirstName = "Alex", LastName = "Johnson", Email = "alex.johnson@example.com", Phone = "555-0103", Gender = "Male", Salary = 72000, Position = "Finance Analyst", HireDate = new DateTime(2023, 2, 5), DepartmentId = departments[2].DepartmentId }
        };

        context.Employees.AddRange(employees);

        var adminUser = new User
        {
            Username = "admin",
            Email = "admin@example.com",
            PasswordHash = PasswordHasher.HashPassword("Admin123!"),
            Role = "Admin",
            CreatedAt = DateTime.UtcNow
        };

        context.Users.Add(adminUser);
        context.SaveChanges();
    }
}
