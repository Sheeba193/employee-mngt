using EmployeeManagement.API.Data;
using EmployeeManagement.API.DTOs;
using EmployeeManagement.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EmployeeManagement.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EmployeesController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public EmployeesController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var employees = await _context.Employees.Include(e => e.Department).ToListAsync();
        return Ok(employees);
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
