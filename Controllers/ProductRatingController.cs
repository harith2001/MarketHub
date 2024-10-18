using Microsoft.AspNetCore.Mvc;
using MarketHub.Repositories;
using MarketHub.Models.Entities;

namespace MarketHub.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductRatingController : ControllerBase
    {
        private readonly ProductRatingRepository _productRatingRepository;

        public ProductRatingController(ProductRatingRepository productRatingRepository)
        {
            _productRatingRepository = productRatingRepository;
        }

        // create a new product rating
        [HttpPost("create")]
        public async Task<IActionResult> CreateProductRating([FromBody] ProductRating productRating)
        {
            try
            {
                await _productRatingRepository.CreateProductRatingAsync(productRating);
                return Ok(new { message = "Product rating created successfully" });
            }
            catch
            {
                return BadRequest(new { message = "Failed to create product rating" });
            }
        }

        // get all product ratings for a product
        [HttpGet("byProductId/{ProductId}")]
        public async Task<IActionResult> GetProductRatingsByProductId(string ProductId)
        {
            var productRatings = await _productRatingRepository.GetProductRatingsByProductIdAsync(ProductId);
            return Ok(productRatings);
        }

        // get all product ratings for a vendor
        [HttpGet("byVendorId/{VendorId}")]
        public async Task<IActionResult> GetProductRatingsByVendorId(string VendorId)
        {
            var productRatings = await _productRatingRepository.GetProductRatingsByVendorIdAsync(VendorId);
            return Ok(productRatings);
        }

        // get all product ratings
        [HttpGet("AllProductRatings")]
        public async Task<IActionResult> GetAllProductRatings()
        {
            var productRatings = await _productRatingRepository.GetAllProductRatingsAsync();
            return Ok(productRatings);
        }

        // get average rating for a product
        [HttpGet("average/{ProductId}")]
        public async Task<IActionResult> GetAverageRatingByProductId(string ProductId)
        {
            var averageRating = await _productRatingRepository.GetAverageRatingByProductIdAsync(ProductId);
            return Ok(new { averageRating });
        }

        // delete a product rating
        [HttpDelete("delete/{ProductRatingId}")]
        public async Task<IActionResult> DeleteProductRating(string ProductRatingId)
        {
            try
            {
                await _productRatingRepository.DeleteProductRatingAsync(ProductRatingId);
                return Ok(new { message = "Product rating deleted successfully" });
            }
            catch
            {
                return BadRequest(new { message = "Failed to delete product rating" });
            }
        }
    }
}