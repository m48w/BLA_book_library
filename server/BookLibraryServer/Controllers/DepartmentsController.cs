using BookLibraryServer.Contract.Logic.Master;
using BookLibraryServer.Models.Master;
using Microsoft.AspNetCore.Mvc;

namespace BookLibraryServer.Controllers
{
    [ApiController]
    [Route("api/v1/departments")]
    [Produces("application/json")]
    public class DepartmentsController : ControllerBase
    {
        private readonly IDepartmentLogic _departmentLogic;

        public DepartmentsController(IDepartmentLogic departmentLogic)
        {
            _departmentLogic = departmentLogic;
        }

        [HttpGet]
        public async Task<IActionResult> GetDepartments()
        {
            var items = await _departmentLogic.GetAllAsync();
            return Ok(items);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetDepartmentById(int id)
        {
            var item = await _departmentLogic.GetByIdAsync(id);
            if (item == null)
            {
                return NotFound();
            }
            return Ok(item);
        }

        [HttpPost]
        public async Task<IActionResult> AddDepartment([FromBody] DepartmentsModel item)
        {
            if (item == null)
            {
                return BadRequest();
            }

            var newItem = await _departmentLogic.AddAsync(item);
            return CreatedAtAction(nameof(GetDepartmentById), new { id = newItem.Id }, newItem);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateDepartment(int id, [FromBody] DepartmentsModel item)
        {
            if (item == null || id == 0)
            {
                return BadRequest();
            }

            var result = await _departmentLogic.UpdateAsync(id, item);

            if (!result)
            {
                return NotFound();
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDepartment(int id)
        {
            var result = await _departmentLogic.DeleteAsync(id);

            if (!result)
            {
                return NotFound();
            }

            return NoContent();
        }
    }
}
