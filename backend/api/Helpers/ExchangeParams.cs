using System.ComponentModel.DataAnnotations;
using MongoDB.Bson;

namespace api.Helpers;

public class ExchangeParams : PaginationParams
{
    [MaxLength(300)]
    public string? Search { get; set; } = string.Empty;

    [MaxLength(30)] public string? OrderBy { get; set; } = "CreatedAt";
}