using Microsoft.AspNetCore.Mvc;
using MarketHub.Repositories;
using MarketHub.Models;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace MarketHub.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly IUserRepository _userRepository;

        public UserController(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        // get all users 
        [HttpGet]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _userRepository.GetAllUsersAsync();
            return Ok(users);
        }

        // get user by email
        [HttpGet("email/{email}")]
        public async Task<IActionResult> GetUserByEmail(string email)
        {
            var user = await _userRepository.GetUserByEmailAsync(email);
            if (user == null) return NotFound();
            return Ok(user);
        }


        // get user by ID
        [HttpGet("{id}")]
        public async Task<IActionResult> GetUserById(string id)
        {
            var user = await _userRepository.GetUserByIdAsync(id);
            if (user == null) return NotFound();
            return Ok(user);
        }

        // create a new user / register 
        [HttpPost]
        public async Task<IActionResult> CreateNewUser([FromBody] User user)
        {
            // Check if role is valid
            var validRoles = new List<string> { "Administrator", "Vendor", "CSR" };
            if (!validRoles.Contains(user.Role))
            {
                return BadRequest(new { message = "Invalid user role." });
            }

            await _userRepository.CreateUserAsync(user);
            return CreatedAtAction(nameof(GetUserById), new { id = user.Id }, user);
        }

        // update an existing user
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(string id, [FromBody] User updatedUser)
        {
            var existingUser = await _userRepository.GetUserByIdAsync(id);
            if (existingUser == null) return NotFound();

            await _userRepository.UpdateUserAsync(id, updatedUser);
            return Ok(existingUser);
        }

        // delete a user
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(string id)
        {
            var user = await _userRepository.GetUserByIdAsync(id);
            if (user == null) return NotFound();

            await _userRepository.DeleteUserAsync(id);
            return NoContent();
        }
    }
}