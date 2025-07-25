using AspNetCore.Identity.MongoDbCore.Models;
using MongoDB.Bson;
using MongoDB.Driver;
using MongoDbGenericRepository.Attributes;

namespace api.Models;

[CollectionName("users")]
public class AppUser : MongoIdentityUser<ObjectId>
{
    public string? IdentifierHash { get; init; }
    public string FirstName { get; init; } = string.Empty;
    public string? LastName { get; init; }
    public string Country { get; init; } = string.Empty;
    public string Provider { get; init; } 
}