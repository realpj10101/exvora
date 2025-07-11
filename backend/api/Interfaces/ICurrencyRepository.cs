using api.DTOs.CurrencyDtos;
using api.DTOs.Helpers;

namespace api.Interfaces;

public interface ICurrencyRepository
{
    public Task<OperationResult<CurrencyResponse>> AddCurrencyAsync(AddCurrencyDto request, CancellationToken cancellationToken);
}