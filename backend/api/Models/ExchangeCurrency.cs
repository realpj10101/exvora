using System.Runtime.InteropServices;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace api.Models;

public record ExchangeCurrency(
    [Optional]
    [property: BsonId, BsonRepresentation(BsonType.ObjectId)]
    ObjectId Id,
    ObjectId? ExchangeId,
    ObjectId? CurrencyId,
    string Symbol
);