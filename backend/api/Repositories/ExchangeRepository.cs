using api.DTOs;
using api.DTOs.Account;
using api.DTOs.ExchangeDtos;
using api.DTOs.Helpers;
using api.Enums;
using api.Extensions;
using api.Helpers;
using api.Interfaces;
using api.Models;
using api.Settings;
using Microsoft.AspNetCore.Identity;
using MongoDB.Bson;
using MongoDB.Driver;
using MongoDB.Driver.Linq;

namespace api.Repositories;

public class ExchangeRepository : IExchangeRepository
{
    private readonly IMongoCollection<Exchange> _collection;
    private readonly ITokenService _tokenService;
    private IExchangeRepository _exchangeRepositoryImplementation;

    public ExchangeRepository(IMongoClient client, IMyMongoDbSettings dbSettings, ITokenService tokenService)
    {
        var database = client.GetDatabase(dbSettings.DatabaseName);
        _collection = database.GetCollection<Exchange>(AppVariablesExtensions.CollectionExchanges);
        _tokenService = tokenService;
    }

    public async Task<OperationResult<ExchangeRes>> CreateExchangeAsync(CreateExchangeDto request, ObjectId? ownerId,
        CancellationToken cancellationToken)
    {
        Exchange foundedExchange = await _collection
            .Find(ex => ex.Name.Trim().ToLower() == request.Name.Trim().ToLower())
            .FirstOrDefaultAsync(cancellationToken);

        if (foundedExchange is not null)
        {
            return new OperationResult<ExchangeRes>(
                false,
                Error: new CustomError(
                    Code: ErrorCode.IsAlreadyExist,
                    Message: "Exchange already exists!"
                )
            );
        }

        Exchange? exchange = Mappers.ConvertCreateExchangeDtoToExchange(request, ownerId);

        if (exchange is null)
        {
            return new OperationResult<ExchangeRes>(
                false,
                Error: new CustomError(
                    Code: ErrorCode.InvalidType,
                    Message: "Enter valid type"
                )
            );
        }

        await _collection.InsertOneAsync(exchange, null, cancellationToken);

        return new OperationResult<ExchangeRes>(
            true,
            Mappers.ConvertExchangeToExchangeRes(exchange),
            Error: null
        );
    }

    public async Task<PagedList<Exchange>> GetAllExchangesAsync(ExchangeParams exParams,
        CancellationToken cancellationToken)
    {
        PagedList<Exchange> exchanges = await PagedList<Exchange>.CreatePagedListAsync(
            CreateQuery(exParams), exParams.PageNumber, exParams.PageSize, cancellationToken
        );

        return exchanges;
    }

    public async Task<PagedList<Exchange>> GetAllUserExchanges(ObjectId? userId, ExchangeParams exchangeParams,
        CancellationToken cancellationToken)
    {
        IMongoQueryable<Exchange> query = _collection.AsQueryable();

        query = query.Where(doc => doc.OwnerId == userId);

        if (!string.IsNullOrEmpty(exchangeParams.OrderBy))
        {
            if (Enum.TryParse<ExchangeStatus>(exchangeParams.OrderBy, true, out var parsedStatus))
            {
                query = query.Where(exchange => exchange.Status == parsedStatus);
            }
        }

        if (!string.IsNullOrEmpty(exchangeParams.Search?.ToUpper()))
        {
            exchangeParams.Search = exchangeParams.Search.ToUpper();

            query = query.Where(
                e => e.Name.Contains(exchangeParams.Search, StringComparison.CurrentCultureIgnoreCase)
            );
        }

        query = query.OrderByDescending(exchange => exchange.CreatedAt);

        return await PagedList<Exchange>
            .CreatePagedListAsync(query, exchangeParams.PageNumber, exchangeParams.PageSize, cancellationToken);
    }

    public async Task<OperationResult<ExchangeRes>> GetByExchangeNameAsync(string exchangeName,
        CancellationToken cancellationToken)
    {
        Exchange exchange = await _collection.Find(exchange => exchange.Name.ToUpper() == exchangeName.ToUpper())
            .FirstOrDefaultAsync(cancellationToken);

        if (exchange is null)
        {
            return new OperationResult<ExchangeRes>(
                false,
                Error: new CustomError(
                    Code: ErrorCode.IsNotFound,
                    Message: "Exchange not found!"
                )
            );
        }

        return new OperationResult<ExchangeRes>(
            true,
            Mappers.ConvertExchangeToExchangeRes(exchange),
            null
        );
    }

    public async Task<OperationResult> ApproveExchangeAsync(string exchangeName, CancellationToken cancellationToken)
    {
        Exchange? exchange = await _collection.Find(exchange => exchange.Name.ToUpper() == exchangeName.ToUpper())
            .FirstOrDefaultAsync(cancellationToken);

        if (exchange is null)
        {
            return new OperationResult(
                false,
                Error: new CustomError(
                    Code: ErrorCode.IsNotFound,
                    "Exchange not found!"
                )
            );
        }

        UpdateDefinition<Exchange> updatedExchange = Builders<Exchange>.Update
            .Set(ex => ex.Status, ExchangeStatus.Approved);

        await _collection.UpdateOneAsync(ex => ex.Name == exchangeName, updatedExchange,
            cancellationToken: cancellationToken);

        return new OperationResult(
            true,
            null
        );
    }

    public async Task<OperationResult> RejectExchangeAsync(string exchangeName, CancellationToken cancellationToken)
    {
        Exchange? exchange = await _collection.Find(exchange => exchange.Name.ToUpper() == exchangeName.ToUpper())
            .FirstOrDefaultAsync(cancellationToken);

        if (exchange is null)
        {
            return new OperationResult(
                false,
                Error: new CustomError(
                    Code: ErrorCode.IsNotFound,
                    "Exchange not found!"
                )
            );
        }

        UpdateDefinition<Exchange> updatedExchange = Builders<Exchange>.Update
            .Set(ex => ex.Status, ExchangeStatus.Rejected);

        await _collection.UpdateOneAsync(ex => ex.Name == exchangeName, updatedExchange,
            cancellationToken: cancellationToken);

        return new OperationResult(
            true,
            null
        );
    }

    public async Task<OperationResult> UpdateExchangeAsync(UpdateExchangeDto request, string exchangeRepository,
        CancellationToken cancellationToken)
    {
        ObjectId? exchangeId = await _collection.AsQueryable()
            .Where(doc => doc.Name.ToUpper() == exchangeRepository.ToUpper())
            .Select(item => item.Id)
            .FirstOrDefaultAsync(cancellationToken);

        if (exchangeId.Equals(null) || exchangeId == ObjectId.Empty)
        {
            return new OperationResult(
                false,
                Error: new CustomError(
                    ErrorCode.IsNotFound,
                    "Exchange not found!"
                )
            );
        }

        var updates = new List<UpdateDefinition<Exchange>>();

        if (!string.IsNullOrWhiteSpace(request.Name))
            updates.Add(Builders<Exchange>.Update.Set(e => e.Name, request.Name.Trim().ToLower()));

        if (!string.IsNullOrWhiteSpace(request.Description))
            updates.Add(Builders<Exchange>.Update.Set(e => e.Description, request.Description.Trim().ToLower()));

        if (!string.IsNullOrWhiteSpace(request.Type))
        {
            if (Enum.TryParse<ExchangeType>(request.Type.Trim(), true, out var parsedType))
            {
                updates.Add(Builders<Exchange>.Update.Set(e => e.Type, parsedType));
            }
            else
            {
                return new OperationResult(
                    false,
                    Error: new CustomError(
                        ErrorCode.InvalidType,
                        Message: "Enter valid type"
                    )
                );
            }
        }

        updates.Add(Builders<Exchange>.Update.Set(e => e.Status, ExchangeStatus.Pending));

        var updateDef = Builders<Exchange>.Update.Combine(updates);

        await _collection.UpdateOneAsync<Exchange>(e => e.Id == exchangeId, updateDef, null, cancellationToken);

        return new OperationResult(
            true,
            null
        );
    }

    private IMongoQueryable<Exchange> CreateQuery(ExchangeParams exchangeParams)
    {
        IMongoQueryable<Exchange> query = _collection.AsQueryable();

        if (!string.IsNullOrEmpty(exchangeParams.OrderBy))
        {
            if (Enum.TryParse<ExchangeStatus>(exchangeParams.OrderBy, true, out var parsedStatus))
            {
                query = query.Where(exchange => exchange.Status == parsedStatus);
            }
        }

        if (!string.IsNullOrEmpty(exchangeParams.Search?.ToUpper()))
        {
            exchangeParams.Search = exchangeParams.Search.ToUpper();

            query = query.Where(
                e => e.Name.Contains(exchangeParams.Search, StringComparison.CurrentCultureIgnoreCase)
            );
        }

        query = query.OrderByDescending(exchange => exchange.CreatedAt);

        return query;
    }
}