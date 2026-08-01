using EmployeeManagement.API.Models;
using Microsoft.AspNetCore.Mvc;

namespace EmployeeManagement.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EmployeesController : ControllerBase
{
    [HttpGet]
    public IActionResult GetAll()
    {
        return Ok(new[]
        {
            new Employee { EmployeeId = 1, FirstName = "John", LastName = "Doe", Email = "john@example.com", Salary = 50000, Position = "Developer", DepartmentId = 1 },
            new Employee { EmployeeId = 2, FirstName = "Jane", LastName = "Smith", Email = "jane@example.com", Salary = 60000, Position = "HR Manager", DepartmentId = 2 }
        });
    }

    [HttpGet("{id:int}")]
    public IActionResult GetById(int id)
    {
        return Ok(new Employee { EmployeeId = id, FirstName = "Sample", LastName = "Employee", Email = "sample@example.com", Salary = 55000, Position = "Analyst", DepartmentId = 1 });
    }

    [HttpPost]
    public IActionResult Create([FromBody] Employee employee)
    {
        return CreatedAtAction(nameof(GetById), new { id = 1 }, employee);
    }

    [HttpPut("{id:int}")]
    public IActionResult Update(int id, [FromBody] Employee employee)
    {
        return Ok(employee);
    }

    [HttpDelete("{id:int}")]
    public IActionResult Delete(int id)
    {
        return NoContent();
    }
}
