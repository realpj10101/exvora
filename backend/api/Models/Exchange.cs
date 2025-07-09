using System.Runtime.InteropServices;
using api.Enums;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace api.Models;

public record Exchange(
    [Optional]
    [property: BsonId, BsonRepresentation(BsonType.ObjectId)]
    ObjectId Id,
    ObjectId OwnerId,
    string Name,
    string Description,
    ExchangeType Type,
    ExchangeStatus Status,
    DateTime CreatedAt
);