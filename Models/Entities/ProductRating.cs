using System.Text.Json.Serialization;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace MarketHub.Models.Entities
{
    public class ProductRating
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public ObjectId Id { get; set; }

        public string productId { get; set; }

        public string CustomerName { get; set; }

        public string Rating { get; set; } // 1-5

        public string Comment { get; set; }

        public string VendorId { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.Now;
    }
}

