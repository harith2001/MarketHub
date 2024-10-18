using MarketHub.Models.Entities;

namespace MarketHub.Models.DTO;

public class OrderRatingDTO
{
    public VendorRating vendorRating { get; set; }
    public List<ProductRating> productRatings { get; set; }
}
