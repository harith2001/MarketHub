using Microsoft.AspNetCore.Mvc;
using MarketHub.Repositories;
using MarketHub.Models.Entities;
using MarketHub.Models;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.AspNetCore.Authorization;

namespace MarketHub.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrderController : ControllerBase
    {
        private readonly OrderRepository _orderRepository;

        public OrderController(OrderRepository orderRepository)
        {
            _orderRepository = orderRepository;
        }

        // create a new order
        [HttpPost("create")]
        public async Task<IActionResult> CreateOrder([FromBody] Order order)
        {
            await _orderRepository.CreateOrderAsync(order);
            return Ok(new { message = "Order placed successfully", orderId = order.Id });
        }

        // get all orders for a customer
        [HttpGet("customer/{CustomerId}")]
        public async Task<IActionResult> GetOrdersByCustomerId(string CustomerId)
        {
            var orders = await _orderRepository.GetOrdersByCustomerIdAsync(CustomerId);
            return Ok(orders);
        }

        //get all orders
        [HttpGet("AllOrders")]
        public async Task<IActionResult> GetAllOrders()
        {
            var orders = await _orderRepository.GetAllOrdersAsync();
            return Ok(orders);
        }


        // get order by ID
        [HttpGet("{OrderID}")]
        public async Task<IActionResult> GetOrderById(string OrderID)
        {
            var order = await _orderRepository.GetOrderByOrderIdAsync(OrderID);
            if (order == null)
                return NotFound();

            return Ok(order);
        }

        //get order status
        [HttpGet("{OrderID}/status")]
        public async Task<IActionResult> GetOrderStatus(string OrderID)
        {
            var status = await _orderRepository.GetOrderStatusAsync(OrderID);
            return Ok(new { status });
        }

        // update order status
        [HttpPut("{OrderID}/{Status}")]
        public async Task<IActionResult> UpdateOrderStatus(string OrderID, string Status)
        {
            await _orderRepository.UpdateOrderStatusAsync(OrderID, Status);
            return Ok(new { message = "Order updated successfully" });
        }

        // delete an order
        [Authorize(Roles = "Admin,CSR")]
        [HttpDelete("{OrderID}")]
        public async Task<IActionResult> DeleteOrder(string OrderID)
        {
            await _orderRepository.DeleteOrderAsync(OrderID);
            return Ok(new { message = "Order deleted successfully" });
        }

    }
}
