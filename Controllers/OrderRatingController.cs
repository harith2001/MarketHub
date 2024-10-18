using Microsoft.AspNetCore.Mvc;
using MarketHub.Repositories;
using MarketHub.Models.DTO;

namespace MarketHub.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrderRatingController : ControllerBase
    {
        private readonly VendorRatingRepository _vendorRatingRepository;
        private readonly ProductRatingRepository _productRatingRepository;

        public OrderRatingController(VendorRatingRepository vendorRatingRepository, ProductRatingRepository productRatingRepository)
        {
            _vendorRatingRepository = vendorRatingRepository;
            _productRatingRepository = productRatingRepository;
        }


        //rate an full order
        [HttpPost]
        [Route("rate")]
        public async Task<IActionResult> RateOrder([FromBody] OrderRatingDTO orderRatingDTO)
        {
            if (orderRatingDTO == null)
            {
                return BadRequest("Order rating data is null.");
            }

            //save VendorRating
            var vendorRating = orderRatingDTO.vendorRating;
            await _vendorRatingRepository.CreateVendorRatingAsync(vendorRating);

            //save each ProductRating
            foreach (var productRating in orderRatingDTO.productRatings)
            {
                await _productRatingRepository.CreateProductRatingAsync(productRating);
            }

            return Ok("Ratings submitted successfully.");
        }

        //get all ratings by order id
        [HttpGet]
        [Route("rate/{OrderID}")]
        public async Task<IActionResult> GetOrderRatingsByOrderId(string OrderID)
        {
            var vendorRatings = await _vendorRatingRepository.GetVendorRatingsByOrderIdAsync(OrderID);
            var productRatings = await _productRatingRepository.GetProductRatingsByOrderIdAsync(OrderID);

            return Ok(new { vendorRatings, productRatings });
        }

    }
}