using System;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;


public class Product
{

    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    public required string productId { get; set; }

    public required string productName { get; set; }

    public required string productType { get; set; }

    public string vendorId { get; set; }

    public int? quantity { get; set; }

    public bool isActive {get; set;}

    public int? lowerMargin { get; set; }

    public bool? restockRequired { get; set; } = false;

    public string? productDescription { get; set; }

    [BsonDateTimeOptions(Kind = DateTimeKind.Local)]
    public DateTime createdDate { get; set; }

    [BsonDateTimeOptions(Kind = DateTimeKind.Local)]
    public DateTime updatedDate { get; set; }

    //image
    public byte[]? productImage { get; set; }

    

}
