using MarketHub.Models.Entities;
using MarketHub.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using MarketHub.Repositories;

var builder = WebApplication.CreateBuilder(args);

// bind MongoDBSettings from appsettings.json
builder.Services.Configure<MongoDBSettings>(
    builder.Configuration.GetSection("MongoDBSettings"));

// register MongoDB clien
builder.Services.AddSingleton<IMongoClient>(sp =>
{
    var settings = sp.GetRequiredService<IOptions<MongoDBSettings>>().Value;
    return new MongoClient(settings.ConnectionString);
});

// Register the IMongoCollection<Notification> for dependency injection
builder.Services.AddSingleton<IMongoCollection<Notification>>(sp =>
{
    var mongoClient = sp.GetRequiredService<IMongoClient>();
    var database = mongoClient.GetDatabase("MarketDB"); 
    return database.GetCollection<Notification>("Notification");
});

// Register the NotificationService for dependency injection
builder.Services.AddSingleton<NotificationService>();

// Add services to the container
builder.Services.AddControllers();

//login and cookie
builder.Services.AddAuthentication("CookieAuth")
    .AddCookie("CookieAuth", config =>
    {
        config.Cookie.Name = "MarketHub.User.Login.Cookie";
        config.LoginPath = "/api/User/login";
        config.AccessDeniedPath = "/api/User/accessdenied";
    });


builder.Services.AddSingleton<IUserRepository, UserRepository>();
builder.Services.AddSingleton<OrderRepository>();
builder.Services.AddSingleton<VendorRatingRepository>();
builder.Services.AddSingleton<PaymentRepository>();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();
//swagger enable
app.UseSwagger();
app.UseSwaggerUI();

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

//swagger url 
var swaggerUrl = $"http://localhost:5000/swagger/index.html";
Console.WriteLine($"Swagger UI is available at: {swaggerUrl}");

app.Run();

