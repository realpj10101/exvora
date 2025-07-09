using api.DTOs.ExchangeDtos;
using api.DTOs.Helpers;
using MongoDB.Bson;

namespace api.Interfaces;

public interface IExchangeRepository
{
    public Task<OperationResult<ExchangeRes>> CreateExchangeAsync(CreateExchangeDto request, ObjectId? ownerId, CancellationToken cancellationToken);
}