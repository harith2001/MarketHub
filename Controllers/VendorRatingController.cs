using Microsoft.AspNetCore.Mvc;
using MarketHub.Repositories;
using MarketHub.Models.Entities;

namespace MarketHub.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class VendorRatingController : ControllerBase
    {
        private readonly VendorRatingRepository _vendorRatingRepository;

        public VendorRatingController(VendorRatingRepository vendorRatingRepository)
        {
            _vendorRatingRepository = vendorRatingRepository;
        }

        // create a new vendor rating
        [HttpPost("create")]
        public async Task<IActionResult> CreateVendorRating([FromBody] VendorRating vendorRating)
        {
            try
            {
                await _vendorRatingRepository.CreateVendorRatingAsync(vendorRating);
                return Ok(new { message = "Vendor rating created successfully" });
            }
            catch
            {
                return BadRequest(new { message = "Failed to create vendor rating" });
            }
        }

        // get all vendor ratings for a vendor
        [HttpGet("byVendorId/{VendorId}")]
        public async Task<IActionResult> GetVendorRatingsByVendorId(string VendorId)
        {
            var vendorRatings = await _vendorRatingRepository.GetVendorRatingsByVendorIdAsync(VendorId);
            return Ok(vendorRatings);
        }

        // get all vendor ratings for a vendor
        [HttpGet("byVendorName/{VendorName}")]
        public async Task<IActionResult> GetVendorRatingsByVendorName(string VendorName)
        {
            var vendorRatings = await _vendorRatingRepository.GetVendorRatingsByVendorNameAsync(VendorName);
            return Ok(vendorRatings);
        }

        // get all vendor ratings
        [HttpGet("AllVendorRatings")]
        public async Task<IActionResult> GetAllVendorRatings()
        {
            var vendorRatings = await _vendorRatingRepository.GetAllVendorRatingsAsync();
            return Ok(vendorRatings);
        }

        // get average rating for a vendor
        [HttpGet("average/{VendorId}")]
        public async Task<IActionResult> GetAverageRatingByVendorId(string VendorId)
        {
            var averageRating = await _vendorRatingRepository.GetAverageRatingByVendorIdAsync(VendorId);
            return Ok(new { averageRating });
        }

    }
}