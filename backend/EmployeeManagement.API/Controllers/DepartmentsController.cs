using EmployeeManagement.API.Models;
using Microsoft.AspNetCore.Mvc;

namespace EmployeeManagement.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DepartmentsController : ControllerBase
{
    [HttpGet]
    public IActionResult GetAll()
    {
        return Ok(new[]
        {
            new Department { DepartmentId = 1, DepartmentName = "IT", Description = "Information Technology" },
            new Department { DepartmentId = 2, DepartmentName = "HR", Description = "Human Resources" }
        });
    }

    [HttpGet("{id:int}")]
    public IActionResult GetById(int id)
    {
        return Ok(new Department { DepartmentId = id, DepartmentName = "IT", Description = "Information Technology" });
    }

    [HttpPost]
    public IActionResult Create([FromBody] Department department)
    {
        return CreatedAtAction(nameof(GetById), new { id = 1 }, department);
    }

    [HttpPut("{id:int}")]
    public IActionResult Update(int id, [FromBody] Department department)
    {
        return Ok(department);
    }

    [HttpDelete("{id:int}")]
    public IActionResult Delete(int id)
    {
        return NoContent();
    }
}
