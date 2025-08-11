namespace api.DTOs.CurrencyDtos;

public record AddCurrencyDto(
    string Symbol,
    string FullName,
    Decimal CurrencyPrice,
    float MarketCap,
    string Category,
    string Status,
    string? FeedProvider,
    string? FeedId,
    string? Quote   
);