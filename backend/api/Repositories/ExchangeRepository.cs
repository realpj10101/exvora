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

    public async Task<PagedList<Exchange>> GetAllExchangesAsync(ExchangeParams exParams, CancellationToken cancellationToken)
    {
        PagedList<Exchange> exchanges = await PagedList<Exchange>.CreatePagedListAsync(
            CreateQuery(exParams), exParams.PageNumber, exParams.PageSize, cancellationToken 
        );

        return exchanges;
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