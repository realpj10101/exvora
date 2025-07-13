using api.DTOs.ExchangeDtos;
using api.DTOs.Helpers;
using api.Helpers;
using api.Models;
using MongoDB.Bson;
using MongoDB.Driver;

namespace api.Interfaces;

public interface IExchangeRepository
{
    public Task<OperationResult<ExchangeRes>> CreateExchangeAsync(CreateExchangeDto request, ObjectId? ownerId, CancellationToken cancellationToken);
    public Task<PagedList<Exchange>> GetAllExchangesAsync(ExchangeParams exParams, CancellationToken cancellationToken);
    public Task<PagedList<Exchange>> GetAllUserExchanges(ObjectId? userId, ExchangeParams exchangeParams, CancellationToken cancellationToken);
    public Task<OperationResult<ExchangeRes>> GetByExchangeNameAsync(string exchangeName, CancellationToken cancellationToken);
    public Task<OperationResult> ApproveExchangeAsync(string exchangeName, CancellationToken cancellationToken);
    public Task<OperationResult> RejectExchangeAsync(string exchangeName, CancellationToken cancellationToken);
    public Task<OperationResult> UpdateExchangeAsync(UpdateExchangeDto request, string exchangeName, CancellationToken cancellationToken);
}