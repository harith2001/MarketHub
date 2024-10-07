using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using System;
using System.Collections.Generic;

[ApiController]
[Route("api/[controller]")]
public class ReviewController : ControllerBase
{
    private readonly IMongoCollection<Review> _reviewCollection;

    public ReviewController(IMongoClient mongoClient)
    {
        var database = mongoClient.GetDatabase("test");
        _reviewCollection = database.GetCollection<Review>("reviews");
    }

    //Create a new review
    [HttpPost("create")]
    public IActionResult CreateReview([FromBody] Review newReview)
    {
        try
        {
            newReview.CreatedDate = DateTime.Now;
            newReview.UpdatedDate = DateTime.Now;

            _reviewCollection.InsertOne(newReview);
            return Ok(new
            {
                Message = "Review created successfully",
                Review = newReview
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new
            {
                Message = "Error creating review",
                Error = ex.Message
            });
        }
    }

    //get all reviews
    [HttpGet("get-all")]
    public IActionResult GetAllReviews()
    {
        try
        {
            var reviews = _reviewCollection.Find(_ => true).ToList();
            return Ok(reviews);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new
            {
                Message = "Error retrieving reviews",
                Error = ex.Message
            });
        }
    }

    //get reviews by vendorId
    [HttpGet("get-by-vendorId/{vendorId}")]
    public IActionResult GetReviewsByVendorId(string vendorId)
    {
        try
        {
            var reviews = _reviewCollection.Find(r => r.VendorId == vendorId).ToList();
            if (reviews.Count == 0)
            {
                return NotFound(new
                {
                    Message = $"No reviews found for VendorId {vendorId}"
                });
            }
            return Ok(reviews);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new
            {
                Message = "Error retrieving reviews by vendorId",
                Error = ex.Message
            });
        }
    }

    //get reviews by productId
    [HttpGet("get-by-productId/{productId}")]
    public IActionResult GetReviewsByProductId(string productId)
    {
        try
        {
            var reviews = _reviewCollection.Find(r => r.ProductId == productId).ToList();
            if (reviews.Count == 0)
            {
                return NotFound(new
                {
                    Message = $"No reviews found for ProductId {productId}"
                });
            }
            return Ok(reviews);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new
            {
                Message = "Error retrieving reviews by productId",
                Error = ex.Message
            });
        }
    }

    //get reviews by orderId
    [HttpGet("get-by-orderId/{orderId}")]
    public IActionResult GetReviewsByOrderId(string orderId)
    {
        try
        {
            var reviews = _reviewCollection.Find(r => r.OrderID == orderId).ToList();
            if (reviews.Count == 0)
            {
                return NotFound(new
                {
                    Message = $"No reviews found for OrderId {orderId}"
                });
            }
            return Ok(reviews);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new
            {
                Message = "Error retrieving reviews by orderId",
                Error = ex.Message
            });
        }
    }

    //get reviews by customerId
    [HttpGet("get-by-customerId/{customerId}")]
    public IActionResult GetReviewsByCustomerId(string customerId)
    {
        try
        {
            var reviews = _reviewCollection.Find(r => r.customerId == customerId).ToList();
            if (reviews.Count == 0)
            {
                return NotFound(new
                {
                    Message = $"No reviews found for customerId {customerId}"
                });
            }
            return Ok(reviews);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new
            {
                Message = "Error retrieving reviews by customerId",
                Error = ex.Message
            });
        }
    }
}
