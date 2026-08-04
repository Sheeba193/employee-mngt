using System.ComponentModel.DataAnnotations;

namespace EmployeeManagement.API.DTOs;

public class DepartmentCreateDto
{
    [Required]
    public string DepartmentName { get; set; } = string.Empty;
    public string? Description { get; set; }
}
