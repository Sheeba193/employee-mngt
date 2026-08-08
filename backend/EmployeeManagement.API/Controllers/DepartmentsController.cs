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
public class DepartmentsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public DepartmentsController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetAll()
    {
        var departments = await _context.Departments.Include(d => d.Employees).ToListAsync();
        return Ok(departments);
    }

    [HttpGet("{id:int}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetById(int id)
    {
        var department = await _context.Departments.Include(d => d.Employees).FirstOrDefaultAsync(d => d.DepartmentId == id);
        if (department is null)
        {
            return NotFound(new { message = "Department not found" });
        }

        return Ok(department);
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Create([FromBody] DepartmentCreateDto dto)
    {
        var department = new Department
        {
            DepartmentName = dto.DepartmentName,
            Description = dto.Description
        };

        _context.Departments.Add(department);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = department.DepartmentId }, department);
    }

    [HttpPut("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update(int id, [FromBody] DepartmentUpdateDto dto)
    {
        var department = await _context.Departments.FindAsync(id);
        if (department is null)
        {
            return NotFound(new { message = "Department not found" });
        }

        department.DepartmentName = dto.DepartmentName;
        department.Description = dto.Description;
        await _context.SaveChangesAsync();
        return Ok(department);
    }

    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        var department = await _context.Departments.FindAsync(id);
        if (department is null)
        {
            return NotFound(new { message = "Department not found" });
        }

        _context.Departments.Remove(department);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
