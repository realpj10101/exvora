using System.ComponentModel.DataAnnotations;
using api.Enums;

namespace api.DTOs.ExchangeDtos;

public record CreateExchangeDto(
    [MaxLength(50)]
    string Name,
    ExchangeType Type,
    [MaxLength(500)]
    string Description
);
