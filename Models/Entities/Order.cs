using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;

namespace MarketHub.Models.Entities
{
	public class Order
	{
		[BsonId]
		[BsonRepresentation(BsonType.ObjectId)]
		public ObjectId Id { get; set; }

		[BsonElement("OrderID")]
		public string OrderID { get; set; }

		public string CustomerId { get; set; }

		public List<OrderItem> Items { get; set; } = new List<OrderItem>();

		public decimal TotalPrice { get; set; }

		public string Status { get; set; } = "Pending";

		public DateTime OrderDate { get; set; } = DateTime.Now;

		public DateTime? ShippedDate { get; set; }

		public string ShippingAddress { get; set; }


		public string GenerateOrderID()
		{
			Random random = new Random();
			int randomNumber = random.Next(1000, 9999);
			return $"ORD-{randomNumber}";
		}

		public class OrderItem
		{
			public string ProductId { get; set; }
			public string VendorId { get; set; }
            public string ProductName { get; set; }
			public string ProductStatus { get; set; } = "Pending";
            public int Quantity { get; set; }
			public decimal Price { get; set; }
		}

	}
}