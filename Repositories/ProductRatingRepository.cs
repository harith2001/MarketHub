using MongoDB.Driver;
using MarketHub.Models.Entities;
using MarketHub.Models;
using Microsoft.Extensions.Options;

namespace MarketHub.Repositories
{
    public class ProductRatingRepository
    {
        private readonly IMongoCollection<ProductRating> _productRating;
        private readonly IMongoCollection<Product> _products;

        public ProductRatingRepository(IOptions<MongoDBSettings> settings, IMongoClient client)
        {
            var database = client.GetDatabase(settings.Value.DatabaseName);
            _productRating = database.GetCollection<ProductRating>("ProductRating");
            _products = database.GetCollection<Product>("products");
        
        }

        //create a new product rating
        public async Task CreateProductRatingAsync(ProductRating productRating)
        {
            var product = await _products.Find(p => p.productId == productRating.productId).FirstOrDefaultAsync() ?? throw new Exception("Product not found");
            productRating.VendorId = product.vendorId;
            await _productRating.InsertOneAsync(productRating);
        }

        //get all product ratings by product id
        public async Task<List<ProductRating>> GetProductRatingsByProductIdAsync(string ProductId) =>
            await _productRating.Find(productRating => productRating.productId == ProductId).ToListAsync();

        //get all product ratings by vendor id
        public async Task<List<ProductRating>> GetProductRatingsByVendorIdAsync(string VendorId) =>
            await _productRating.Find(productRating => productRating.VendorId == VendorId).ToListAsync();

        //get all product ratings
        public async Task<List<ProductRating>> GetAllProductRatingsAsync() =>
            await _productRating.Find(productRating => true).ToListAsync();

        //calculate average rating for a product
        public async Task<double> GetAverageRatingByProductIdAsync(string ProductId)
        {
            var productRatings = await _productRating.Find(productRating => productRating.productId == ProductId).ToListAsync();
            double totalRating = 0;
            foreach (var rating in productRatings)
            {
                totalRating += double.Parse(rating.Rating);
            }
            return totalRating / productRatings.Count;
        }

        //delete a product rating
        public async Task DeleteProductRatingAsync(string ProductRatingId) =>
            await _productRating.DeleteOneAsync(productRating => productRating.productId== ProductRatingId);

    }
}