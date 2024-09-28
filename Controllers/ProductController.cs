using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;

[ApiController]
[Route("api/[controller]")]
public class ProductController : ControllerBase
{
    private readonly IMongoClient _mongoClient;
    private readonly IMongoDatabase _database;
    private readonly IMongoCollection<Product> _productCollection;
    private readonly NotificationService _notificationService;

    public ProductController(IMongoClient mongoClient, NotificationService notificationService)
    {
        _mongoClient = mongoClient;
        _database = _mongoClient.GetDatabase("test");
        _productCollection = _database.GetCollection<Product>("products");
        _notificationService = notificationService;
    }

    //get all products
    [HttpGet("get-all-products")]
    public IActionResult GetAllProducts()
    {
        try
        {

            var products = _productCollection.Find(product => true).ToList();

            return Ok(products);
        }
        catch (Exception ex) {
            return StatusCode(500, new
            {
                Message = "Error fetching products",
                Error = ex.Message
            });

        }
    }

    //get active products
    [HttpGet("get-all-active-products")]
    public IActionResult GetAllActiveProducts()
    {
        try
        {

            var activeProducts = _productCollection.Find(p => p.isActive == true).ToList();

            if (activeProducts == null || activeProducts.Count == 0)
            {
                return NotFound(new
                {
                    Message = "No Active products",

                });
            }

            return Ok(activeProducts);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new
            {
                Message = "Error fetching active products",
                Error = ex.Message
            });

        }
    }

    //get product by productId
    [HttpGet("get-by-productId/{productId}")]
    public IActionResult GetProductByProductId(String productId)
    {
        try
        {
            var product = _productCollection.Find(p => p.productId == productId).FirstOrDefault();

            if (product == null)
            {
                return NotFound(new
                {
                    Message = $"Product with productId {productId} not found.",
                });
            }

            return Ok(product);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new
            {
                Message = "Error fetching product by productId",
                Error = ex.Message
            });


        }
    }

    //get product by productType
    [HttpGet("get-by-productType/{productType}")]
    public IActionResult GetProductsByProductType(String productType)
    {
        try
        {
            var products = _productCollection.Find(p => p.productType == productType).ToList();

            if (products == null || products.Count == 0)
            {
                return NotFound(new
                {
                    Message = $"Products with productType {productType} cannot be  found.",
                });
            }

            return Ok(products);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new
            {
                Message = "Error fetching product by productId",
                Error = ex.Message
            });


        }
    }

    //get product by vendor
    [HttpGet("get-by-vendor/{vendorId}")]
    public IActionResult GetProductsByVendor(String vendorId)
    {
        try
        {
            var products = _productCollection.Find(p => p.vendorId == vendorId).ToList();

            if (products == null || products.Count == 0)
            {
                return NotFound(new
                {
                    Message = $"Products for vendor with {vendorId} cannot be  found.",
                });
            }

            return Ok(products);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new
            {
                Message = "Error fetching product by vendorId",
                Error = ex.Message
            });


        }
    }

    //get stock status
    [HttpGet("get-stock-status/{vendorId}")]
    public IActionResult GetStockStatusByVendor(String vendorId)
    {
        try
        {
            var products = _productCollection
                .Find(p => p.vendorId == vendorId)
                .Project(p => new
                {   
                    productId = p.productId,
                    productName = p.productName,
                    productType = p.productType,
                    quantity = p.quantity,
                    restockRequired = p.restockRequired,
                })
                .ToList();

            if (products == null || products.Count == 0)
            {
                return NotFound(new
                {
                    Message = $"Stock status for vendor with {vendorId} cannot be  found.",
                });
            }

            return Ok(products);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new
            {
                Message = "Error fetching Stock status",
                Error = ex.Message
            });


        }
    }

    //get low stock items
    [HttpGet("get-lowStock-products/{vendorId}")]
    public IActionResult GetLowStockProductsByVendor(String vendorId)
    {
        try
        {
            var products = _productCollection
                .Find(p => p.vendorId == vendorId && p.restockRequired == true)
                .Project(p => new
                {
                    productId = p.productId,
                    productName = p.productName,
                    productType = p.productType,
                    quantity = p.quantity,
                    
                })
                .ToList();

            if (products == null || products.Count == 0)
            {
                return NotFound(new
                {
                    Message = $"Low stock status for vendor with {vendorId} cannot be  found.",
                });
            }

            foreach(var product in products)
            {
                _notificationService.CreateNotification(
                    "Low Stock Alert",
                    $"Product {product.productName} is low on stock",
                    $"The product {product.productName} has a low quantity of {product.quantity}.",
                    "stock",
                    "v-001"
                    );
            }

            return Ok(products);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new
            {
                Message = "Error fetching Stock status",
                Error = ex.Message
            });


        }
    }

    //create a new product
    [HttpPost("add-new-product")]
    public IActionResult AddNewProduct([FromBody] Product newProduct)
    {
        try
        {   
            //check for productId duplication
            var existingProduct = _productCollection.Find(p => p.productId == newProduct.productId).FirstOrDefault(); 
            
            if(existingProduct != null)
            {
                return StatusCode(400 ,new
                {
                    Message = $"Product with ID {newProduct.productId} already exists",
                });
            }

            newProduct.createdDate = DateTime.Now;
            newProduct.updatedDate = DateTime.Now;
            newProduct.isActive = true;
            newProduct.restockRequired = false;
            _productCollection.InsertOne(newProduct);

            return Ok(new
            {
                Message = "Successfully added a new product",
                Product = newProduct
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new
            {
                Message = "Error adding a new  product",
                Error = ex.Message
            });
        }
    }

    //update a product
    [HttpPatch("update-product/{productId}")]
    public IActionResult UpdateProduct(String productId , [FromBody] Product updatedProduct)
    {
        if(updatedProduct == null)
        {
            return BadRequest(new
            {
                Message = "Invalid Product Data",
            });
        }

        try
        {
            var existingProduct = _productCollection.Find(p => p.productId == productId).FirstOrDefault();

            if(existingProduct == null)
            {
                return NotFound(new
                {
                    Message = $"Product with productId {productId} not found."
                });
            }

            //update only the provided fields

            if (!string.IsNullOrWhiteSpace(updatedProduct.productId))
                existingProduct.productId = updatedProduct.productId;

            if (!string.IsNullOrWhiteSpace(updatedProduct.productName))
                existingProduct.productName = updatedProduct.productName;

            if (!string.IsNullOrWhiteSpace(updatedProduct.productType))
                existingProduct.productType = updatedProduct.productType;

            if (!string.IsNullOrWhiteSpace(updatedProduct.productDescription))
                existingProduct.productDescription = updatedProduct.productDescription;

            if(updatedProduct.quantity.HasValue && updatedProduct.quantity >= 0)
            {
                existingProduct.quantity = updatedProduct.quantity;

                if(existingProduct.quantity < existingProduct.lowerMargin)
                {
                    existingProduct.restockRequired = true;
                }
                else
                {
                    existingProduct.restockRequired = false;
                }
            }

            //update the lastUpdate date
            existingProduct.updatedDate = DateTime.Now;

            //set the active status
            existingProduct.isActive = updatedProduct.isActive;

            //save updated details
            _productCollection.ReplaceOne(p => p.productId == productId , existingProduct);

            return Ok(new
            {
                Message = "Product updated successfully",
                Product = existingProduct
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new
            {
                Message = "Error updating product",
                Error = ex.Message
            });
        }
    }

    //delete a product
    [HttpDelete("delete-product/{productId}")]
    public IActionResult DeleteProduct(string productId)
    {
        try
        {
            var exisitingProduct = _productCollection.Find(p => p.productId == productId).FirstOrDefault();

            if (exisitingProduct == null)
            {
                return NotFound(new
                {
                    Message = $"Product with productId {productId} not found."
                });
            }

            //delete the product
            _productCollection.DeleteOne(p => p.productId == productId);

            return Ok(new
            {
                Message = $"Product with productId {productId} successfully deleted."
            });


        }
        catch (Exception ex)
        {
            {
                return StatusCode(500, new
                {
                    Message = "Error deleting product",
                    Error = ex.Message
                });
            }
        }
    }

}
