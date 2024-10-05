using Microsoft.AspNetCore.Mvc;
using MarketHub.Repositories;
using MarketHub.Models.Entities;
using MarketHub.Models;
//using MarketHub.Models.DTO;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;

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
        [HttpGet("{User_ID}")]
        public async Task<IActionResult> GetUserById(string User_ID)
        {
            var user = await _userRepository.GetUserByIdAsync(User_ID);
            if (user == null) return NotFound();
            return Ok(user);
        }

        //access denied
        [HttpGet("accessdenied")]
        public IActionResult AccessDenied()
        {
            return Unauthorized(new { message = "Access denied." });
        }

        // create a new user / register 
        [HttpPost]
        public async Task<IActionResult> CreateNewUser([FromBody] User user)
        {
            // Check if role is valid
            var validRoles = new List<string> { "Admin", "Vendor", "CSR" ,"Customer" };
            if (!validRoles.Contains(user.Role))
            {
                return BadRequest(new { message = "Invalid user role." });
            }

            //hash the password
            user.Password = PasswordHasherUtil.HashPassword(user.Password);

            await _userRepository.CreateUserAsync(user);
            return CreatedAtAction(nameof(GetUserById), new { User_ID = user.User_ID }, user);
        }

        //update the IsActive status of a user - only for admin and CSR
        [Authorize(Roles = "Admin,CSR")]
        [HttpPut("status/{User_ID}/{status}")]
        public async Task<IActionResult> UpdateUserStatus(string User_ID, bool status )
        {
            var existingUser = await _userRepository.GetUserByIdAsync(User_ID);
            if (existingUser == null) return NotFound();

            existingUser.IsActive = status;

            await _userRepository.UpdateUserStatusAsync(User_ID, status);
            return Ok(existingUser);
        }

        // update an existing user
        [HttpPut("{User_ID}")]
        public async Task<IActionResult> UpdateUser(string User_ID, [FromBody] User updatedUser)
        {
            var existingUser = await _userRepository.GetUserByIdAsync(User_ID);
            if (existingUser == null) return NotFound();

            await _userRepository.UpdateUserAsync(User_ID, updatedUser);
            return Ok(existingUser);
        }

        // delete a user
        [HttpDelete("{User_ID}")]
        public async Task<IActionResult> DeleteUser(string User_ID)
        {
            var user = await _userRepository.GetUserByIdAsync(User_ID);
            if (user == null) return NotFound();

            await _userRepository.DeleteUserAsync(User_ID);
            return NoContent();
        }

        //get vendors by name
        [HttpGet("vendors/{name}")]
        public async Task<IActionResult> GetVendorsByName(string name)
        {
            var vendors = await _userRepository.GetVendorsByNameAsync(name);
            return Ok(vendors);
        }

        //login a user
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel loginModel)
        {
            var user = await _userRepository.GetUserByEmailAsync(loginModel.Email);
            if (user == null || !PasswordHasherUtil.PasswordVerification(user.Password, loginModel.Password) || !user.IsActive)
            {
                return Unauthorized(new { message = "Invalid email or password, or inactive account" });
            }

            // create user claims for authentication
            var claims = new List<Claim>
            {
                 new Claim(ClaimTypes.Name, user.Name),
                 new Claim(ClaimTypes.Role, user.Role)
            };

            var claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
            var authProperties = new AuthenticationProperties
            {
                //IsPersistent = loginModel.RememberMe 
            };

            // Sign in the user with cookie authentication
            await HttpContext.SignInAsync(
                "CookieAuth",
                new ClaimsPrincipal(claimsIdentity),
                authProperties);

            return Ok(new { message = "Login successful." });
        }

        //logout a user
        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync("CookieAuth");
            return Ok(new { message = "Logout successful." });
        }

    }
}
