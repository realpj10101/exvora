using api.Enums;

namespace api.DTOs.CurrencyDtos;

public record CurrencyResponse(
    string Symbol,
    string FullName,
    float Price,
    float MarketCap,
    CurrencyType Category,
    CurrencyStatus Status,
    string? FeedProvider,
    string? FeedId,
    string Quote,
    DateTime? UpdatedAtUtc
);