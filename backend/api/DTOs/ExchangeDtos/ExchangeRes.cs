using api.Enums;

namespace api.DTOs.ExchangeDtos;

public record ExchangeRes(
    string ExchangeName,
    string Description,
    ExchangeType ExchangeType,
    ExchangeStatus ExchangeStatus,
    DateTime CreatedAt
);