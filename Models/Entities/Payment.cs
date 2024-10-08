using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;

namespace MarketHub.Models.Entities
{
    public class Payment
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public ObjectId Id { get; set; }

        [BsonElement("PaymentID")]
        public string PaymentID { get; set; }

        public string OrderID { get; set; }

        public string CustomerId { get; set; }

        public decimal Amount { get; set; }

        public string PaymentMethod { get; set; }

        public string Status { get; set; } = "Completed";

        public DateTime PaymentDate { get; set; } = DateTime.Now;

        public DateTime createdAt { get; set; } = DateTime.Now;

        public string GeneratePaymentID()
        {
            Random random = new Random();
            int randomNumber = random.Next(1000, 9999);
            return $"PAY-{randomNumber}";
        }
    }
}