using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using System;
using System.Collections.Generic;

[ApiController]
[Route("api/[controller]")]
public class ProductTypeController : ControllerBase
{
    private readonly IMongoCollection<ProductType> _productTypeCollection;

    public ProductTypeController(IMongoClient mongoClient)
    {
        var database = mongoClient.GetDatabase("MarketDB");
        _productTypeCollection = database.GetCollection<ProductType>("productTypes");
    }

    // Create a new product type
    [HttpPost("create")]
    public IActionResult CreateProductType([FromBody] ProductType newProductType)
    {
        try
        {
            _productTypeCollection.InsertOne(newProductType);
            return Ok(new
            {
                Message = "Product type created successfully",
                ProductType = newProductType
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new
            {
                Message = "Error creating product type",
                Error = ex.Message
            });
        }
    }

    // Get all product types
    [HttpGet("get-all")]
    public IActionResult GetAllProductTypes()
    {
        try
        {
            var productTypes = _productTypeCollection.Find(_ => true).ToList();
            return Ok(productTypes);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new
            {
                Message = "Error retrieving product types",
                Error = ex.Message
            });
        }
    }

    // Delete a product type by Id
    [HttpDelete("delete/{id}")]
    public IActionResult DeleteProductType(string id)
    {
        try
        {
            var result = _productTypeCollection.DeleteOne(pt => pt.productTypeId == id);
            if (result.DeletedCount == 0)
            {
                return NotFound(new
                {
                    Message = $"Product type with Id {id} not found"
                });
            }
            return Ok(new
            {
                Message = $"Product type with Id {id} deleted successfully"
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new
            {
                Message = "Error deleting product type",
                Error = ex.Message
            });
        }
    }
}
