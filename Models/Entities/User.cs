using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;

namespace MarketHub.Models.Entities
{
    public class User
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public ObjectId Id { get; set; }

        //custom user_id
        [BsonElement("User_ID")]
        public string User_ID { get; set; }

        public required string Name { get; set; }

        public required string Email { get; set; }

        public required string Password { get; set; }

        public bool IsActive { get; set; }

        // a role based user_id generate
        private string role;
        public required string Role
        {
            get => role;
            set
            {
                role = value;
                if(string.IsNullOrEmpty(User_ID)){
                User_ID = GenerateCustomUserId(role);
                }
            }
        }

        public DateTime CreatedAt { get; set; } = DateTime.Now;

        //genereate based on role
        private string GenerateCustomUserId(string role)
        {
            string prefix = role switch
            {
                "Admin" => "ADM",
                "Customer" => "CUS",
                "Vendor" => "VEN",
                "CSR" => "CSR",
                _ => "USR" 
            };

            Random random = new Random();
            int randomNumber = random.Next(1000, 9999); 

            return $"{prefix}{randomNumber}"; 
        }
    }
}
