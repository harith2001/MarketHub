using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;

namespace MarketHub.Models.Entities
{
    public class VendorRating
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public ObjectId Id { get; set; }

        public string VendorId { get; set; }

        public string VendorName { get; set; }

        public string CustomerName { get; set; }

        public string Rating { get; set; } // 1-5

        public string Comment { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.Now;
    }
}

