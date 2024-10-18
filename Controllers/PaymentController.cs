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
    public class PaymentController : ControllerBase
    {
        private readonly PaymentRepository _paymentRepository;

        public PaymentController(PaymentRepository paymentRepository)
        {
            _paymentRepository = paymentRepository;
        }

        // add a new payment
        [HttpPost("create")]
        public async Task<IActionResult> CreatePayment([FromBody] Payment payment)
        {
            try
            {
                await _paymentRepository.CreatePaymentAsync(payment);
                return Ok(new { message = "Payment created successfully", paymentId = payment.PaymentID });
            }
            catch
            {
                return BadRequest(new { message = "Payment not created" });
            }
        }

            // get payment details by ID
            [HttpGet("{paymentId}")]
        public async Task<IActionResult> GetPaymentById(string paymentId)
        {
            var payment = await _paymentRepository.GetPaymentByIdAsync(paymentId);
            if (payment == null)
                return NotFound(new { message = "Payment not found" });

            return Ok(payment);
        }

        //get payment details by Order ID
        [HttpGet("order/{orderId}")]
        public async Task<IActionResult> GetPaymentByOrderId(string orderId)
        {
            var payment = await _paymentRepository.GetPaymentByOrderIdAsync(orderId);
            if (payment == null)
                return NotFound(new { message = "Payment not found" });

            return Ok(payment);
        }

        //get payment details by Customer ID
        [HttpGet("customer/{customerId}")]
        public async Task<IActionResult> GetPaymentByCustomerId(string customerId)
        {
            var payment = await _paymentRepository.GetPaymentByCustomerIDAsync(customerId);
            if (payment == null)
                return NotFound(new { message = "Payment not found" });

            return Ok(payment);
        }

        //get all payments
        [HttpGet("all")]
        public async Task<IActionResult> GetAllPayments()
        {
            var payments = await _paymentRepository.GetAllPaymentsAsync();
            return Ok(payments);
        }

        //delete a payment - Admin only
        [Authorize(Roles = "Admin")]
        [HttpDelete("{paymentId}")]
        public async Task<IActionResult> DeletePayment(string paymentId)
        {
            await _paymentRepository.DeletePaymentAsync(paymentId);
            return Ok(new { message = "Payment deleted successfully" });
        }
    }
}