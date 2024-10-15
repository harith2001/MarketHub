using System.Collections.Generic;
using System.Threading.Tasks;
using MarketHub.Models.Entities;
using MarketHub.Models.DTO;

namespace MarketHub.Repositories
{
    public interface IUserRepository
    {
        Task<List<User>> GetAllUsersAsync();
        Task<List<User>> GetDeactivatedUsersAsync();
        Task<List<User>> GetDeactivatedCustomersAsync();
        Task<User> GetUserByEmailAsync(string email);
        Task<User> GetUserByIdAsync(string User_ID);
        Task CreateUserAsync(User user);
        Task UpdateUserAsync(string User_ID, User updatedUser);
        Task DeleteUserAsync(string User_ID);
        Task UpdateUserStatusAsync(string User_ID, bool status);
        Task<List<VendorDTO>> GetVendorsByNameAsync(string name);
    }
}
