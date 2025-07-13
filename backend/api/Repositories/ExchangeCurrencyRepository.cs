using api.DTOs;
using api.DTOs.Account;
using api.DTOs.ExchangeCurrencyDtos;
using api.DTOs.Helpers;
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
        var symbol = request.Symbol.Trim().ToLowerInvariant();
        var exch = exchangeName.Trim().ToLowerInvariant();

        Task<ExchangeCurrency> dupTask =
            _collection.Find(ex => ex.Symbol == symbol).FirstOrDefaultAsync(cancellationToken);

        Task<ObjectId> exIdTask = _collectionExchange.AsQueryable()
            .Where(doc => doc.Name == exch)
            .Select(item => item.Id)
            .FirstOrDefaultAsync(cancellationToken);

        Task<ObjectId> curIdTask = _collectionCurrency.AsQueryable()
            .Where(doc => doc.Symbol == symbol)
            .Select(item => item.Id)
            .FirstOrDefaultAsync(cancellationToken);

        await Task.WhenAll(dupTask, exIdTask, curIdTask);

        if (dupTask is not null)
        {
            return new OperationResult(
                false,
                Error: new CustomError(
                    ErrorCode.IsAlreadyExist,
                    "Exchange currency already exists."
                )
            );
        }

        if (exIdTask.Equals(null) || exIdTask.Result == ObjectId.Empty)
        {
            return new OperationResult(
                false,
                Error: new CustomError(
                    ErrorCode.IsExchangeNotFound,
                    "Exchange not found."
                )
            );
        }

        if (curIdTask.Equals(null) || exIdTask.Result == ObjectId.Empty)
        {
            return new OperationResult(
                false,
                Error: new CustomError(
                    ErrorCode.IsCurrencyNotFound,
                    "Currency not found."
                )
            );
        }

        ExchangeCurrency exchangeCurrency = Mappers.ConvertAddExCurDtoToExCur(request, exIdTask.Result, curIdTask.Result);

        await _collection.InsertOneAsync(exchangeCurrency, null, cancellationToken);

        return new OperationResult(
            true,
            null
        );
    }
}


// Old Code
// ExchangeCurrency? foundedExchangeCurrency = await _collection
//     .Find(doc => doc.Symbol.ToUpper() == request.Symbol.ToUpper()).FirstOrDefaultAsync(cancellationToken);
//
// if (foundedExchangeCurrency is not null)
// {
//     return new OperationResult(
//         false,
//         Error: new CustomError(
//             ErrorCode.IsAlreadyExist,
//             "Exchange currency already exists."
//         )
//     );
// }
//
// ObjectId? exchangeId = await _collectionExchange.AsQueryable()
//     .Where(exchange => exchange.Name.ToUpper() == exchangeName.ToUpper())
//     .Select(item => item.Id)
//     .FirstOrDefaultAsync(cancellationToken);
//
// if (exchangeId.Equals(null) || exchangeId == ObjectId.Empty)
// {
//     return new OperationResult(
//         false,
//         Error: new CustomError(
//             ErrorCode.IsExchangeNotFound,
//             "Exchange not found."
//         )
//     );
// }
//
// ObjectId? currencyId = await _collectionCurrency.AsQueryable()
//     .Where(currency => currency.Symbol.ToUpper() == request.Symbol.ToUpper())
//     .Select(item => item.Id)
//     .FirstOrDefaultAsync(cancellationToken);
//
// if (exchangeId.Equals(null) || exchangeId == ObjectId.Empty)
// {
//     return new OperationResult(
//         false,
//         Error: new CustomError(
//             ErrorCode.IsCurrencyNotFound,
//             "Currency not found."
//         )
//     );
// }