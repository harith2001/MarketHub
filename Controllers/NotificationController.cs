using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;

[ApiController]
[Route("api/[controller]")]
public class NotificationController : ControllerBase
{
    private readonly NotificationService _notificationService;

    public NotificationController(NotificationService notificationService)
    {
        _notificationService = notificationService;
    }

    // Create a new notification
    [HttpPost("create")]
    public IActionResult CreateNotification([FromBody] Notification notification)
    {
        try
        {
            _notificationService.CreateNotification(
                notification.Name,
                notification.Title,
                notification.Content,
                notification.Type,
                notification.TargetUserId);

            return Ok(new { Message = "Notification created successfully" });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { Message = "Error creating notification", Error = ex.Message });
        }
    }

   // Get notifications for a user
   [HttpGet("get-for-user/{userId}")]
    public IActionResult GetNotificationsForUser(string userId)
    {
        try
        {
            var notifications = _notificationService.GetNotificationsByUserId(userId);
            return Ok(notifications);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { Message = "Error fetching notifications", Error = ex.Message });
        }
    }
}