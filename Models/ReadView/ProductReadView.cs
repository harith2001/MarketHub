namespace MarketHub.Models.ReadView
{
    public class ProductReadView
    {
        public required string ProductId { get; set; }
        public required string ProductName { get; set; }
        public required string ProductType { get; set; }
        public string? ProductDescription { get; set; }
        public string? ProductImage { get; set; }
        public int? Quantity { get; set; }
        public double Price { get; set; }
        public bool IsActive { get; set; }
        public Rating? Rating { get; set; }
        public VendorDetails? Vendor { get; set; }
    }

    public class VendorDetails
    {
        public required string VendorId { get; set; }
        public required string VendorName { get; set; }
        public required Rating Rating { get; set; }
    }

    public class Rating
    {
        public required double Rate { get; set; }
        public required int Count { get; set; }
    }
}
