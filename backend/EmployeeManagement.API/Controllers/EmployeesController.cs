using EmployeeManagement.API.Data;
using EmployeeManagement.API.DTOs;
using EmployeeManagement.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EmployeeManagement.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class EmployeesController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public EmployeesController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(
        string? name,
        string? email,
        string? department,
        string? position,
        string? gender,
        decimal? minSalary,
        decimal? maxSalary,
        int page = 1,
        int pageSize = 10)
    {
        var query = _context.Employees.Include(e => e.Department).AsQueryable();

        if (!string.IsNullOrWhiteSpace(name))
        {
            query = query.Where(e => (e.FirstName + " " + e.LastName).Contains(name));
        }

        if (!string.IsNullOrWhiteSpace(email))
        {
            query = query.Where(e => e.Email.Contains(email));
        }

        if (!string.IsNullOrWhiteSpace(department))
        {
            query = query.Where(e => e.Department != null && e.Department.DepartmentName.Contains(department));
        }

        if (!string.IsNullOrWhiteSpace(position))
        {
            query = query.Where(e => e.Position != null && e.Position.Contains(position));
        }

        if (!string.IsNullOrWhiteSpace(gender))
        {
            query = query.Where(e => e.Gender != null && e.Gender.Equals(gender, StringComparison.OrdinalIgnoreCase));
        }

        if (minSalary.HasValue)
        {
            query = query.Where(e => e.Salary >= minSalary.Value);
        }

        if (maxSalary.HasValue)
        {
            query = query.Where(e => e.Salary <= maxSalary.Value);
        }

        page = Math.Max(page, 1);
        pageSize = Math.Clamp(pageSize, 1, 100);

        var totalRecords = await query.CountAsync();
        var totalPages = (int)Math.Ceiling(totalRecords / (double)pageSize);

        var employees = await query
            .OrderBy(e => e.EmployeeId)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return Ok(new
        {
            currentPage = page,
            pageSize,
            totalPages,
            totalRecords,
            data = employees
        });
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var employee = await _context.Employees.Include(e => e.Department).FirstOrDefaultAsync(e => e.EmployeeId == id);
        if (employee is null)
        {
            return NotFound(new { message = "Employee not found" });
        }

        return Ok(employee);
    }

    [HttpGet("search")]
    public Task<IActionResult> Search(
        string? name,
        string? email,
        string? department,
        string? position,
        string? gender,
        decimal? minSalary,
        decimal? maxSalary,
        int page = 1,
        int pageSize = 10)
    {
        return GetAll(name, email, department, position, gender, minSalary, maxSalary, page, pageSize);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] EmployeeCreateDto employeeDto)
    {
        var department = await _context.Departments.FindAsync(employeeDto.DepartmentId);
        if (department is null)
        {
            return BadRequest(new { message = "Department does not exist" });
        }

        var employee = new Employee
        {
            FirstName = employeeDto.FirstName,
            LastName = employeeDto.LastName,
            Email = employeeDto.Email,
            Phone = employeeDto.Phone,
            Gender = employeeDto.Gender,
            Salary = employeeDto.Salary,
            Position = employeeDto.Position,
            HireDate = employeeDto.HireDate,
            DepartmentId = employeeDto.DepartmentId
        };

        _context.Employees.Add(employee);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = employee.EmployeeId }, employee);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] EmployeeUpdateDto employeeDto)
    {
        var existingEmployee = await _context.Employees.FindAsync(id);
        if (existingEmployee is null)
        {
            return NotFound(new { message = "Employee not found" });
        }

        var department = await _context.Departments.FindAsync(employeeDto.DepartmentId);
        if (department is null)
        {
            return BadRequest(new { message = "Department does not exist" });
        }

        existingEmployee.FirstName = employeeDto.FirstName;
        existingEmployee.LastName = employeeDto.LastName;
        existingEmployee.Email = employeeDto.Email;
        existingEmployee.Phone = employeeDto.Phone;
        existingEmployee.Gender = employeeDto.Gender;
        existingEmployee.Salary = employeeDto.Salary;
        existingEmployee.Position = employeeDto.Position;
        existingEmployee.HireDate = employeeDto.HireDate;
        existingEmployee.DepartmentId = employeeDto.DepartmentId;

        await _context.SaveChangesAsync();
        return Ok(existingEmployee);
    }

    [HttpDelete("{id:int}")]
    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        var employee = await _context.Employees.FindAsync(id);
        if (employee is null)
        {
            return NotFound(new { message = "Employee not found" });
        }

        _context.Employees.Remove(employee);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
