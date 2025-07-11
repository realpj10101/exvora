using System.Runtime.InteropServices;
using api.Enums;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace api.Models;

public record Currency(
    [Optional]
    [property: BsonId, BsonRepresentation(BsonType.ObjectId)]
    ObjectId Id,
    string Symbol,
    string FullName,
    float CurrencyPrice,
    float MarketCap,
    CurrencyType Category,
    CurrencyStatus Status
);