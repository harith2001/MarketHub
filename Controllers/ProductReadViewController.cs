using MarketHub.Models.ReadView;
using MarketHub.Repositories;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using System.Linq;

namespace MarketHub.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductReadViewController : ControllerBase
    {
        private readonly IMongoClient _mongoClient;
        private readonly IMongoDatabase _database;
        private readonly IMongoCollection<Product> _productCollection;
        private readonly UserRepository _userRepository;
        private readonly VendorRatingRepository _vendorRatingRepository;
        private readonly ProductRatingRepository _productRatingRepository;

        public ProductReadViewController(IMongoClient mongoClient, UserRepository userRepository, VendorRatingRepository vendorRatingRepository, ProductRatingRepository productRatingRepository)
        {
            _mongoClient = mongoClient;
            _database = _mongoClient.GetDatabase("MarketDB");
            _productCollection = _database.GetCollection<Product>("products");
            _userRepository = userRepository;
            _vendorRatingRepository = vendorRatingRepository;
            _productRatingRepository = productRatingRepository;
        }

        private string GetImageUrl(string productId)
        {
            return $"Product/get-product-image/{productId}";
        }

        [HttpGet("")]
        public async Task<IActionResult> GetProducts()
        {
            try
            {
                var products = _productCollection.Find(product => true).ToList();
                var vendors = await _userRepository.GetAllVendorsAsync();
                var vendorRatings = await _vendorRatingRepository.GetAllVendorRatingsAsync();
                var productRatings = await _productRatingRepository.GetAllProductRatingsAsync();

                var productReadViews = products.Select(product =>
                {
                    var vendor = vendors.FirstOrDefault(v => v.User_ID == product.vendorId);

                    var ratings = vendorRatings
                        .Where(r => r.VendorId == product.vendorId)
                        .Select(r =>
                        {
                            return int.TryParse(r.Rating, out var numericRating) ? numericRating : 0;
                        }).ToList();
                    var averageRating = ratings.Count != 0 ? ratings.Average() : 0.0;
                    var totalRatings = ratings.Count;

                    var productRatingsList = productRatings.Where(r => r.productId == product.productId)
                        .Select(r => int.TryParse(r.Rating, out var numericRating) ? numericRating : 0)
                        .ToList();
                    var productAverageRating = productRatingsList.Count != 0 ? productRatingsList.Average() : 0.0;
                    var productTotalRatings = productRatingsList.Count;


                    return new ProductReadView
                    {
                        ProductId = product.productId,
                        ProductName = product.productName,
                        ProductType = product.productType,
                        ProductDescription = product.productDescription,
                        ProductImage = product.productImage != null ? GetImageUrl(product.productId) : null,
                        Quantity = product.quantity,
                        Price = Convert.ToDouble(product.price),
                        IsActive = product.isActive,
                        Rating = new Rating
                        {
                            Rate = productAverageRating,
                            Count = productTotalRatings
                        },
                        Vendor = vendor != null ? new VendorDetails
                        {
                            VendorId = vendor.User_ID,
                            VendorName = vendor.Name,
                            Rating = new Rating
                            {
                                Rate = averageRating,
                                Count = totalRatings
                            }
                        } : null
                    };
                }).ToList();

                return Ok(productReadViews);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    Message = "Error fetching product read view",
                    Error = ex.Message
                });
            }
        }

        [HttpGet("by-product-id/{productId}")]
        public async Task<IActionResult> GetProductById(string productId)
        {
            try
            {
                var product = _productCollection.Find(p => p.productId == productId).FirstOrDefault();
                if (product == null)
                {
                    return NotFound(new { Message = $"Product with ID {productId} not found." });
                }

                var vendor = await _userRepository.GetUserByIdAsync(product.vendorId);
                var vendorRatings = await _vendorRatingRepository.GetVendorRatingsByVendorIdAsync(product.vendorId);
                var productRatings = await _productRatingRepository.GetProductRatingsByProductIdAsync(productId);

                var ratings = vendorRatings
                    .Where(r => r.VendorId == product.vendorId)
                    .Select(r => int.TryParse(r.Rating, out var numericRating) ? numericRating : 0)
                    .ToList();
                var averageRating = ratings.Count != 0 ? ratings.Average() : 0.0;
                var totalRatings = ratings.Count;

                var productRatingsList = productRatings
                    .Select(r => int.TryParse(r.Rating, out var numericRating) ? numericRating : 0)
                    .ToList();
                var productAverageRating = productRatingsList.Count != 0 ? productRatingsList.Average() : 0.0;
                var productTotalRatings = productRatingsList.Count;

                var productReadView = new ProductReadView
                {
                    ProductId = product.productId,
                    ProductName = product.productName,
                    ProductType = product.productType,
                    ProductDescription = product.productDescription,
                    ProductImage = product.productImage != null ? GetImageUrl(product.productId) : null,
                    Quantity = product.quantity,
                    Price = Convert.ToDouble(product.price),
                    IsActive = product.isActive,
                    Rating = new Rating
                    {
                        Rate = productAverageRating,
                        Count = productTotalRatings
                    },
                    Vendor = vendor != null ? new VendorDetails
                    {
                        VendorId = vendor.User_ID,
                        VendorName = vendor.Name,
                        Rating = new Rating
                        {
                            Rate = averageRating,
                            Count = totalRatings
                        }
                    } : null
                };

                return Ok(productReadView);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    Message = "Error fetching product by ID",
                    Error = ex.Message
                });
            }
        }

        [HttpGet("by-product-type/{productType}")]
        public async Task<IActionResult> GetProductsByType(string productType)
        {
            try
            {
                var products = _productCollection.Find(p => p.productType == productType).ToList();
                if (products.Count == 0)
                {
                    return NotFound(new { Message = $"No products found for product type {productType}." });
                }

                var vendors = await _userRepository.GetAllVendorsAsync();
                var vendorRatings = await _vendorRatingRepository.GetAllVendorRatingsAsync();
                var productRatings = await _productRatingRepository.GetAllProductRatingsAsync();

                var productReadViews = products.Select(product =>
                {
                    var vendor = vendors.FirstOrDefault(v => v.User_ID == product.vendorId);
                    var ratings = vendorRatings
                        .Where(r => r.VendorId == product.vendorId)
                        .Select(r => int.TryParse(r.Rating, out var numericRating) ? numericRating : 0)
                        .ToList();
                    var averageRating = ratings.Count != 0 ? ratings.Average() : 0.0;
                    var totalRatings = ratings.Count;

                    var productRatingsList = productRatings.Where(r => r.productId == product.productId)
                        .Select(r => int.TryParse(r.Rating, out var numericRating) ? numericRating : 0)
                        .ToList();
                    var productAverageRating = productRatingsList.Count != 0 ? productRatingsList.Average() : 0.0;
                    var productTotalRatings = productRatingsList.Count;

                    return new ProductReadView
                    {
                        ProductId = product.productId,
                        ProductName = product.productName,
                        ProductType = product.productType,
                        ProductDescription = product.productDescription,
                        ProductImage = product.productImage != null ? GetImageUrl(product.productId) : null,
                        Quantity = product.quantity,
                        Price = Convert.ToDouble(product.price),
                        IsActive = product.isActive,
                        Rating = new Rating
                        {
                            Rate = productAverageRating,
                            Count = productTotalRatings
                        },
                        Vendor = vendor != null ? new VendorDetails
                        {
                            VendorId = vendor.User_ID,
                            VendorName = vendor.Name,
                            Rating = new Rating
                            {
                                Rate = averageRating,
                                Count = totalRatings
                            }
                        } : null
                    };
                }).ToList();

                return Ok(productReadViews);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    Message = "Error fetching products by product type",
                    Error = ex.Message
                });
            }
        }

        [HttpGet("search")]
        public async Task<IActionResult> SearchProducts([FromQuery] string query)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(query))
                {
                    return BadRequest(new { Message = "Query parameter is required for searching." });
                }

                var filterBuilder = Builders<Product>.Filter;
                var filter = filterBuilder.Or(
                    filterBuilder.Regex(p => p.productName, new MongoDB.Bson.BsonRegularExpression(query, "i")),
                    filterBuilder.Regex(p => p.productType, new MongoDB.Bson.BsonRegularExpression(query, "i"))
                );

                var products = _productCollection.Find(filter).ToList();
                if (products.Count == 0)
                {
                    return NotFound(new { Message = "No products found matching the search criteria." });
                }

                var vendors = await _userRepository.GetAllVendorsAsync();
                var vendorRatings = await _vendorRatingRepository.GetAllVendorRatingsAsync();
                var productRatings = await _productRatingRepository.GetAllProductRatingsAsync();

                var productReadViews = products.Select(product =>
                {
                    var vendor = vendors.FirstOrDefault(v => v.User_ID == product.vendorId);
                    var ratings = vendorRatings
                        .Where(r => r.VendorId == product.vendorId)
                        .Select(r => int.TryParse(r.Rating, out var numericRating) ? numericRating : 0)
                        .ToList();
                    var averageRating = ratings.Count != 0 ? ratings.Average() : 0.0;
                    var totalRatings = ratings.Count;

                    var productRatingsList = productRatings.Where(r => r.productId == product.productId)
                        .Select(r => int.TryParse(r.Rating, out var numericRating) ? numericRating : 0)
                        .ToList();
                    var productAverageRating = productRatingsList.Count != 0 ? productRatingsList.Average() : 0.0;
                    var productTotalRatings = productRatingsList.Count;

                    return new ProductReadView
                    {
                        ProductId = product.productId,
                        ProductName = product.productName,
                        ProductType = product.productType,
                        ProductDescription = product.productDescription,
                        ProductImage = product.productImage != null ? GetImageUrl(product.productId) : null,
                        Quantity = product.quantity,
                        Price = Convert.ToDouble(product.price),
                        IsActive = product.isActive,
                        Rating = new Rating
                        {
                            Rate = productAverageRating,
                            Count = productTotalRatings
                        },
                        Vendor = vendor != null ? new VendorDetails
                        {
                            VendorId = vendor.User_ID,
                            VendorName = vendor.Name,
                            Rating = new Rating
                            {
                                Rate = averageRating,
                                Count = totalRatings
                            }
                        } : null
                    };
                }).ToList();

                return Ok(productReadViews);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    Message = "Error searching for products",
                    Error = ex.Message
                });
            }
        }
    }
}
