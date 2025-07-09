using api.DTOs;
using api.DTOs.Account;
using api.DTOs.ExchangeDtos;
using api.DTOs.Helpers;
using api.Extensions;
using api.Interfaces;
using api.Models;
using api.Settings;
using Microsoft.AspNetCore.Identity;
using MongoDB.Bson;
using MongoDB.Driver;

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
}