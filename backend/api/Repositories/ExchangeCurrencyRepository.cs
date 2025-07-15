using api.DTOs;
using api.DTOs.Account;
using api.DTOs.ExchangeCurrencyDtos;
using api.DTOs.Helpers;
using api.Enums;
using api.Extensions;
using api.Interfaces;
using api.Models;
using api.Settings;
using MongoDB.Bson;
using MongoDB.Driver;
using MongoDB.Driver.Linq;

namespace api.Repositories;

public class ExchangeCurrencyRepository : IExchangeCurrencyRepository
{
    private readonly IMongoCollection<ExchangeCurrency> _collection;
    private readonly IMongoCollection<Exchange> _collectionExchange;
    private readonly IMongoCollection<Currency> _collectionCurrency;
    private readonly ITokenService _tokenService;

    public ExchangeCurrencyRepository(IMongoClient client, IMyMongoDbSettings dbSettings, ITokenService tokenService)
    {
        var database = client.GetDatabase(dbSettings.DatabaseName);
        _collection = database.GetCollection<ExchangeCurrency>(AppVariablesExtensions.CollectionExchangeCurrencies);
        _collectionExchange = database.GetCollection<Exchange>(AppVariablesExtensions.CollectionExchanges);
        _collectionCurrency = database.GetCollection<Currency>(AppVariablesExtensions.CollectionCurrencies);

        _tokenService = tokenService;
    }

    public async Task<OperationResult> AddExchangeCurrencyAsync(AddExCurrency request,
        string exchangeName, CancellationToken cancellationToken)
    {
        ExchangeCurrency? foundedExchangeCurrency = await _collection
            .Find(doc => doc.Symbol.ToUpper() == request.Symbol.ToUpper()).FirstOrDefaultAsync(cancellationToken);

        if (foundedExchangeCurrency is not null)
        {
            return new OperationResult(
                false,
                Error: new CustomError(
                    ErrorCode.IsAlreadyExist,
                    "Exchange currency already exists."
                )
            );
        }

        ObjectId? exchangeId = await _collectionExchange.AsQueryable()
            .Where(exchange => exchange.Name.ToUpper() == exchangeName.ToUpper())
            .Select(item => item.Id)
            .FirstOrDefaultAsync(cancellationToken);

        if (exchangeId.Equals(null) || exchangeId == ObjectId.Empty)
        {
            return new OperationResult(
                false,
                Error: new CustomError(
                    ErrorCode.IsExchangeNotFound,
                    "Exchange not found."
                )
            );
        }

        ExchangeStatus exchangeStatus = await _collectionExchange.AsQueryable()
            .Where(doc => doc.Id == exchangeId)
            .Select(item => item.Status)
            .FirstOrDefaultAsync(cancellationToken);

        if (exchangeStatus == ExchangeStatus.Pending || exchangeStatus == ExchangeStatus.Rejected)
        {
            return new OperationResult(
                false,
                Error: new CustomError(
                    ErrorCode.IsApproved,
                    Message: "Exchange is not approved for add currency."
                )
            );
        }

        ObjectId? currencyId = await _collectionCurrency.AsQueryable()
            .Where(currency => currency.Symbol.ToUpper() == request.Symbol.ToUpper())
            .Select(item => item.Id)
            .FirstOrDefaultAsync(cancellationToken);

        if (currencyId.Equals(null) || currencyId == ObjectId.Empty)
        {
            return new OperationResult(
                false,
                Error: new CustomError(
                    ErrorCode.IsCurrencyNotFound,
                    "Currency not found."
                )
            );
        }

        ExchangeCurrency exchangeCurrency = Mappers.ConvertAddExCurDtoToExCur(request, exchangeId, currencyId);

        await _collection.InsertOneAsync(exchangeCurrency, null, cancellationToken);

        return new OperationResult(
            true,
            null
        );
    }
}