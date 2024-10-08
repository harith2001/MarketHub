using MongoDB.Driver;
using MarketHub.Models.Entities;
using MarketHub.Models;
using Microsoft.Extensions.Options;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MarketHub.Repositories
{
    public class OrderRepository
    {
        private readonly IMongoCollection<Order> _orders;
        private readonly IMongoCollection<OrderHistory> _orderHistory;

        public OrderRepository(IOptions<MongoDBSettings> settings, IMongoClient client)
        {
            var database = client.GetDatabase(settings.Value.DatabaseName);
            _orders = database.GetCollection<Order>("Orders");
            _orderHistory = database.GetCollection<OrderHistory>("OrderHistory");
        }

        //create a new order
        public async Task CreateOrderAsync(Order order)
        {
            if (string.IsNullOrEmpty(order.OrderID))
            {
                order.OrderID = order.GenerateOrderID();
            }
            await _orders.InsertOneAsync(order);
        }

        //get all orders for a customer 
        public async Task<List<Order>> GetOrdersByCustomerIdAsync(string CustomerId) =>
            await _orders.Find(order => order.CustomerId == CustomerId).ToListAsync();

        //get all orders
        public async Task<List<Order>> GetAllOrdersAsync() =>
            await _orders.Find(order => true).ToListAsync();

        //get a specific order by Order_ID
        public async Task<Order> GetOrderByOrderIdAsync(string OrderID) =>
            await _orders.Find(order => order.OrderID == OrderID).FirstOrDefaultAsync();

        //get a specific status by Order_ID
        public async Task<string> GetOrderStatusAsync(string OrderID) =>
            (await _orders.Find(order => order.OrderID == OrderID).FirstOrDefaultAsync()).Status;

        //delete an order
        public async Task DeleteOrderAsync(string OrderID) =>
         await _orders.DeleteOneAsync(order => order.OrderID == OrderID);

        //update order status
        public async Task UpdateOrderStatusAsync(string OrderID, string Status)
        {
            //update the order status
            var updateResult = await _orders.UpdateOneAsync(
                order => order.OrderID == OrderID,
                Builders<Order>.Update.Set(order => order.Status, Status)
            );

            //if the order status is set to "Completed", create order history
            if (Status == "Completed" && updateResult.ModifiedCount > 0)
            {
                // Fetch the updated order to create order history
                var completedOrder = await _orders.Find(order => order.OrderID == OrderID).FirstOrDefaultAsync();

                if (completedOrder != null)
                {
                    var orderHistory = new OrderHistory
                    {
                        OrderID = completedOrder.OrderID,
                        CustomerId = completedOrder.CustomerId,
                        CompletedDate = DateTime.Now,
                        TotalPrice = completedOrder.TotalPrice,
                        ShippingAddress = completedOrder.ShippingAddress,
                        Items = completedOrder.Items
                    };
                    await _orderHistory.InsertOneAsync(orderHistory);
                }
            }
        }

    }
}