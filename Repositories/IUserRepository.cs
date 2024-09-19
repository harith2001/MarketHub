using System.Collections.Generic;
using System.Threading.Tasks;
using MarketHub.Models;

namespace MarketHub.Repositories
{
    public interface IUserRepository
    {
        Task<List<User>> GetAllUsersAsync();
        Task<User> GetUserByEmailAsync(string email);
        Task<User> GetUserByIdAsync(string id);
        Task CreateUserAsync(User user);
        Task UpdateUserAsync(string id, User updatedUser);
        Task DeleteUserAsync(string id);
    }
}
