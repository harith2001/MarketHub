using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;

[ApiController]
[Route("api/[controller]")]
public class ProductController : ControllerBase
{
    private readonly IMongoClient _mongoClient;

    public ProductController(IMongoClient mongoClient)
    {
        _mongoClient = mongoClient;
    }

    // Test connection method
    [HttpGet("test-connection")]
    public IActionResult TestMongoConnection()
    {
        try
        {
            // Get the database (from appsettings.json)
            var database = _mongoClient.GetDatabase("EcommerceDB");

            // Get the list of collections as a test
            var collections = database.ListCollectionNames().ToList();

            // If collections are found, return success message
            return Ok(new
            {
                Message = "MongoDB connection successful",
                Collections = collections
            });
        }
        catch (Exception ex)
        {
            // If there's an error, return the error message
            return StatusCode(500, new
            {
                Message = "MongoDB connection failed",
                Error = ex.Message
            });
        }
    }
}
