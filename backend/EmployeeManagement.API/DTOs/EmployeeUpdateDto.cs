using System.ComponentModel.DataAnnotations;

namespace EmployeeManagement.API.DTOs;

public class EmployeeUpdateDto
{
    [Required]
    public string FirstName { get; set; } = string.Empty;

    [Required]
    public string LastName { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    public string? Phone { get; set; }
    public string? Gender { get; set; }
    public decimal Salary { get; set; }
    public string? Position { get; set; }
    public DateTime HireDate { get; set; } = DateTime.UtcNow;
    [Required]
    public int DepartmentId { get; set; }
}
