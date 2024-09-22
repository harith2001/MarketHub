using MongoDB.Driver;
using MarketHub.Models;
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

        //update user
        public async Task UpdateUserAsync(string User_ID, User updatedUser) =>
            await _users.ReplaceOneAsync(user => user.User_ID == User_ID, updatedUser);

        //delete user
        public async Task DeleteUserAsync(string User_ID) =>
           await _users.DeleteOneAsync(user => user.User_ID == User_ID);
    }
}