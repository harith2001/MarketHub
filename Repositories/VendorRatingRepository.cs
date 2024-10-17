using MongoDB.Driver;
using MarketHub.Models.Entities;
using MarketHub.Models;
using Microsoft.Extensions.Options;

namespace MarketHub.Repositories
{
    public class VendorRatingRepository
    {
        private readonly IMongoCollection<VendorRating> _vendorRating;

        public VendorRatingRepository(IOptions<MongoDBSettings> settings, IMongoClient client)
        {
            var database = client.GetDatabase(settings.Value.DatabaseName);
            _vendorRating = database.GetCollection<VendorRating>("VendorRating");
        }

        //create a new vendor rating
        public async Task CreateVendorRatingAsync(VendorRating vendorRating)=>
            await _vendorRating.InsertOneAsync(vendorRating);

        //get all vendor ratings by vendor id
        public async Task<List<VendorRating>> GetVendorRatingsByVendorIdAsync(string VendorId) =>
            await _vendorRating.Find(vendorRating => vendorRating.VendorId == VendorId).ToListAsync();

        //get all vendor ratings by vendor name
        public async Task<List<VendorRating>> GetVendorRatingsByVendorNameAsync(string VendorName) =>
            await _vendorRating.Find(vendorRating => vendorRating.VendorName == VendorName).ToListAsync();

        //get vendor ratings by order id
        public async Task<List<VendorRating>> GetVendorRatingsByOrderIdAsync(string OrderID) =>
            await _vendorRating.Find(vendorRating => vendorRating.OrderID == OrderID).ToListAsync();

        //get all vendor ratings
        public async Task<List<VendorRating>> GetAllVendorRatingsAsync() =>
            await _vendorRating.Find(vendorRating => true).ToListAsync();

        //calculate average rating for a vendor
        public async Task<double> GetAverageRatingByVendorIdAsync(string VendorId)
        {
            var vendorRatings = await _vendorRating.Find(vendorRating => vendorRating.VendorId == VendorId).ToListAsync();
            double totalRating = 0;
            foreach (var rating in vendorRatings)
            {
                totalRating += double.Parse(rating.Rating);
            }
            return totalRating / vendorRatings.Count;
        }

    }
}