using api.DTOs;
using api.DTOs.Account;
using api.DTOs.CurrencyDtos;
using api.DTOs.Helpers;
using api.Extensions;
using api.Interfaces;
using api.Models;
using api.Settings;
using MongoDB.Bson;
using MongoDB.Driver;

namespace api.Repositories;

public class CurrencyRepository : ICurrencyRepository
{
    private readonly IMongoCollection<Currency> _collection;
    private readonly ITokenService _tokenService;

    public CurrencyRepository(IMongoClient client, IMyMongoDbSettings dbSettings, ITokenService tokenService)
    {
        var database = client.GetDatabase(dbSettings.DatabaseName);
        _collection = database.GetCollection<Currency>(AppVariablesExtensions.CollectionCurrencies);
        _tokenService = tokenService;
    }

    public async Task<OperationResult<CurrencyResponse>> AddCurrencyAsync(AddCurrencyDto request,
        CancellationToken cancellationToken)
    {
        Currency foundedCurrency = await _collection
            .Find(cur => cur.Symbol.Trim().ToLower() == request.Symbol.Trim().ToLower())
            .FirstOrDefaultAsync(cancellationToken);

        if (foundedCurrency is not null)
        {
            return new OperationResult<CurrencyResponse>(
                false,
                Error: new CustomError(
                    Code: ErrorCode.DuplicateCurrency,
                    Message: "Currency already exists!"
                )
            );
        }

        Currency? currency = Mappers.ConvertAddCurrencyToCurrency(request);

        if (currency is null)
        {
            return new OperationResult<CurrencyResponse>(
                false,
                Error: new CustomError(
                    Code: ErrorCode.InvalidType,
                    Message: "Enter a valid currency type or statues!"
                )
            );
        }

        await _collection.InsertOneAsync(currency, null, cancellationToken);

        return new OperationResult<CurrencyResponse>(
            true,
            Mappers.ConvertCurrencyToCurrencyResponse(currency),
            Error: null
        );
    }

    public async Task<List<CurrencyResponse>> GetAllAsync(CancellationToken cancellationToken)
    {
        List<Currency> currencies = await _collection.Find(new BsonDocument()).ToListAsync();

        List<CurrencyResponse> currencyResponses = [];

        foreach (Currency currency in currencies)
        {
            CurrencyResponse currencyResponse = Mappers.ConvertCurrencyToCurrencyResponse(currency);

            currencyResponses.Add(currencyResponse);
        }

        return currencyResponses;
    }
}