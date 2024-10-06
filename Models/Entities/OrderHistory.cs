using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;

namespace MarketHub.Models.Entities
{
    public class OrderHistory
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public ObjectId Id { get; set; }

        public string OrderID { get; set; }

        public string CustomerId { get; set; }

        public DateTime CompletedDate { get; set; }

        public decimal TotalPrice { get; set; }

        public string ShippingAddress { get; set; }

        public List<Order.OrderItem> Items { get; set; } = new List<Order.OrderItem>();
    }
}
