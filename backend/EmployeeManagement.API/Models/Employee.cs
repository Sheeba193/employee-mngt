namespace EmployeeManagement.API.Models;

public class Employee
{
    public int EmployeeId { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public string? Gender { get; set; }
    public decimal Salary { get; set; }
    public string? Position { get; set; }
    public DateTime HireDate { get; set; }
    public int DepartmentId { get; set; }
    public Department? Department { get; set; }
}
