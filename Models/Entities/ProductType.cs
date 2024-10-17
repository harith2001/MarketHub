using System;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;


public class ProductType
{

    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    public required string productTypeId { get; set; }

    public required string productTypeName { get; set; }

    
    

}
