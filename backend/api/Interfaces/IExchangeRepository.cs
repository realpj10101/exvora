using api.DTOs.ExchangeDtos;
using api.DTOs.Helpers;
using api.Helpers;
using api.Models;
using MongoDB.Bson;

namespace api.Interfaces;

public interface IExchangeRepository
{
    public Task<OperationResult<ExchangeRes>> CreateExchangeAsync(CreateExchangeDto request, ObjectId? ownerId, CancellationToken cancellationToken);
    public Task<PagedList<Exchange>> GetAllExchangesAsync(ExchangeParams exParams, CancellationToken cancellationToken);
}