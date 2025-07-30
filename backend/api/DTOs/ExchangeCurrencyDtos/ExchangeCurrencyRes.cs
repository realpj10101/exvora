using api.DTOs.CurrencyDtos;
using api.DTOs.ExchangeDtos;

namespace api.DTOs.ExchangeCurrencyDtos;

public record ExchangeCurrencyRes(
    ExchangeRes Exchange,
    List<CurrencyResponse> Currencies
    // CurrencyResponse Currency
);