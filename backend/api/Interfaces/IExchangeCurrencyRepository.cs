using api.DTOs.ExchangeCurrencyDtos;
using api.DTOs.Helpers;
using api.Models;

namespace api.Interfaces;

public interface IExchangeCurrencyRepository
{
    public Task<OperationResult> AddExchangeCurrencyAsync(AddExCurrency request, string exchangeName, CancellationToken cancellationToken);
}