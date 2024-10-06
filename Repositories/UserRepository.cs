using MongoDB.Driver;
using MarketHub.Models.Entities;
using MarketHub.Models;
using MarketHub.Models.DTO;
using Microsoft.Extensions.Options;

namespace MarketHub.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly IMongoCollection<User> _users;

        public UserRepository(IOptions<MongoDBSettings> settings,IMongoClient client)
        {
            var database = client.GetDatabase(settings.Value.DatabaseName);
            _users = database.GetCollection<User>("Users");
        }

        //get all users
        public async Task<List<User>> GetAllUsersAsync()=>
          await _users.Find(user => true).ToListAsync();

        //get user by email
        public async Task<User> GetUserByEmailAsync(string email) =>
          await _users.Find(user => user.Email == email).FirstOrDefaultAsync();

        //get user by id
        public async Task<User> GetUserByIdAsync(string User_ID) =>
             await _users.Find(user => user.User_ID == User_ID).FirstOrDefaultAsync();

        //create new user / register
        public async Task CreateUserAsync(User user) =>
                        await _users.InsertOneAsync(user);

        //update user status (active/inactive)
       public async Task UpdateUserStatusAsync(string User_ID, bool status) =>
            await _users.UpdateOneAsync(user => user.User_ID == User_ID, Builders<User>.Update.Set(user => user.IsActive, status));

        //update user
        public async Task UpdateUserAsync(string User_ID, User updatedUser) =>
            await _users.ReplaceOneAsync(user => user.User_ID == User_ID, updatedUser);

        //delete user
        public async Task DeleteUserAsync(string User_ID) =>
           await _users.DeleteOneAsync(user => user.User_ID == User_ID);

        //get vendors by name 
        public async Task<List<VendorDTO>> GetVendorsByNameAsync(string name) 
        {
            var filter = Builders<User>.Filter.Eq(user => user.Name, name) & Builders<User>.Filter.Eq(user => user.Role, "Vendor");

            var projection = Builders<User>.Projection.Expression(user => new VendorDTO
            {
                User_ID = user.User_ID,
                Name = user.Name,
                Email = user.Email,
                IsActive = user.IsActive
            });

            var result = await _users.Find(filter).Project(projection).ToListAsync();
            return result;
        }
    }
}