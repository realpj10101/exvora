using System.ComponentModel.DataAnnotations;
using api.Enums;

namespace api.DTOs.ExchangeDtos;

public record CreateExchangeDto(
    [MaxLength(50)]
    string Name,
    string Type,
    [MaxLength(500)]
    string Description
);
