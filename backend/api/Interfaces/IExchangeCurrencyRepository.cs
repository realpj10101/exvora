using api.DTOs.ExchangeCurrencyDtos;
using api.DTOs.Helpers;
using api.Helpers;
using api.Models;

namespace api.Interfaces;

public interface IExchangeCurrencyRepository
{
    public Task<OperationResult> AddExchangeCurrencyAsync(AddExCurrency request, string exchangeName, CancellationToken cancellationToken);
    public Task<PagedList<ExchangeCurrencyRes>?> GetExchangeCurrenciesAsync(ExchangeParams exchangeParams, string exchangeName, CancellationToken cancellationToken);
}