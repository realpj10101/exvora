namespace api.DTOs.CurrencyDtos;

public record AddCurrencyDto(
    string Symbol,
    string FullName,
    float CurrencyPrice,
    float MarketCap,
    string Category,
    string Status   
);