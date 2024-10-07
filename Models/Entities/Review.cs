using System;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

public class Review
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    public required string Title { get; set; }

    public required string customerId { get; set; }

    public string? Description { get; set; }

    public string? OrderID { get; set; }

    public string? VendorId { get; set; }
   
    public string? ProductId { get; set; }

    [BsonDateTimeOptions(Kind = DateTimeKind.Local)]
    public DateTime CreatedDate { get; set; } = DateTime.Now;

    [BsonDateTimeOptions(Kind = DateTimeKind.Local)]
    public DateTime UpdatedDate { get; set; } = DateTime.Now;


}



