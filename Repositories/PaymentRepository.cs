using MongoDB.Driver;
using MarketHub.Models.Entities;
using MarketHub.Models;
using Microsoft.Extensions.Options;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MarketHub.Repositories
{
    public class PaymentRepository
    {
        private readonly IMongoCollection<Payment> _payments;

        public PaymentRepository(IOptions<MongoDBSettings> settings, IMongoClient client)
        {
            var database = client.GetDatabase(settings.Value.DatabaseName);
            _payments = database.GetCollection<Payment>("Payments");
        }

        //create a new payment
        public async Task CreatePaymentAsync(Payment payment)
        {
            if (string.IsNullOrEmpty(payment.PaymentID))
            {
                payment.PaymentID = payment.GeneratePaymentID();
            }
            await _payments.InsertOneAsync(payment);
        }

        //get a specific payment by Payment_ID
        public async Task<Payment> GetPaymentByIdAsync(string PaymentID)
        {
            return await _payments.Find(p => p.PaymentID == PaymentID).FirstOrDefaultAsync();
        }

        //get all payments by Order_ID
        public async Task<Payment> GetPaymentByOrderIdAsync(string OrderID)
        {
            return await _payments.Find(p => p.OrderID == OrderID).FirstOrDefaultAsync();
        }

        //get all payments by Customer_ID
        public async Task <Payment> GetPaymentByCustomerIDAsync(string CustomerId)
        {
            return await _payments.Find(p => p.CustomerId == CustomerId).FirstOrDefaultAsync();
        }

        //get all payments done - Admin only
        public async Task<List<Payment>> GetAllPaymentsAsync()
        {
            return await _payments.Find(p => true).ToListAsync();
        }

        //delete a payment - Admin only
        public async Task DeletePaymentAsync(string paymentID)
        {
            await _payments.DeleteOneAsync(p => p.PaymentID == paymentID);
        }
    }
}