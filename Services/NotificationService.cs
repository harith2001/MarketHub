using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;

public class NotificationService
{
    private readonly IMongoCollection<Notification> _notificationCollection;

    public NotificationService(IMongoCollection<Notification> notificationCollection)
    {
        _notificationCollection = notificationCollection;
    }

    //create new notification
    public void CreateNotification(string name , string title , string content , string type , string targetUserId , string? orderId = null)
    {
        var notification = new Notification
        {
            Name = name,
            Title = title,
            Content = content,
            Type = type,
            TargetUserId = targetUserId,
            OrderId = orderId,
            CreatedDate = DateTime.Now,
        };

        _notificationCollection.InsertOne(notification);
    }

    // get notifications by user ID
    public List<Notification> GetNotificationsByUserId(string userId)
    {
        
        var filter = Builders<Notification>.Filter.Eq(n => n.TargetUserId, userId);
        return _notificationCollection.Find(filter).ToList();
    }

    //get-all notifications
    public List<Notification> GetAllNotifications()
    {
        return _notificationCollection.Find(notification => true).ToList();
    }
}