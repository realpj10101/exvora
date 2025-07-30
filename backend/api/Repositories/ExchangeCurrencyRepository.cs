using System.Runtime.InteropServices;
using api.DTOs;
using api.DTOs.Account;
using api.DTOs.CurrencyDtos;
using api.DTOs.ExchangeCurrencyDtos;
using api.DTOs.ExchangeDtos;
using api.DTOs.Helpers;
using api.Enums;
using api.Extensions;
using api.Helpers;
using api.Interfaces;
using api.Models;
using api.Settings;
using Microsoft.AspNetCore.Mvc.RazorPages;
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

        bool isExists = await _collection.AsQueryable()
            .AnyAsync(
                doc => doc.ExchangeId == exchangeId && doc.Symbol.ToUpper() == request.Symbol.ToUpper(),
                cancellationToken);

        if (isExists)
        {
            return new OperationResult(
                false,
                Error: new CustomError(
                    ErrorCode.IsAlreadyExist,
                    "This exchange already lists that currency.")
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

    public async Task<PagedList<ExchangeCurrencyRes>?> GetExchangeCurrenciesAsync(ExchangeParams exchangeParams,
        string exchangeName, CancellationToken cancellationToken)
    {
        Exchange? exchange = await _collectionExchange.Find(doc => doc.Name.ToUpper() == exchangeName.ToUpper())
            .FirstOrDefaultAsync(cancellationToken);

        if (exchange is null)
            return null;

        var rawResult = await _collection.AsQueryable<ExchangeCurrency>() // create new obj List<{Exchange, Currency}>
            .Where(exchangeCur => exchangeCur.ExchangeId == exchange.Id)
            .Join(
                _collectionExchange.AsQueryable(),
                eCur => eCur.ExchangeId,
                ex => ex.Id,
                (ec, ex) => new { ec, ex }
            )
            .Join(
                _collectionCurrency.AsQueryable(),
                exCur => exCur.ec.CurrencyId,
                cu => cu.Id,
                (exCur, cu) => new
                {
                    Exchange = exCur.ex,
                    Currency = cu
                }
            ).ToListAsync(cancellationToken);

        var groupedResult = rawResult
            .GroupBy(item => item.Exchange.Id)
            .Select(group => new ExchangeCurrencyRes(
                Mappers.ConvertExchangeToExchangeRes(group.First().Exchange),
                group.Select(cur => Mappers.ConvertCurrencyToCurrencyResponse(cur.Currency)).ToList()
            )).ToList();

        // var mappedList = rawResult.Select(item => new ExchangeCurrencyRes(
        //     Mappers.ConvertExchangeToExchangeRes(item.Exchange),
        //     Mappers.ConvertCurrencyToCurrencyResponse(item.Currency)
        // )).ToList();

        return await PagedList<ExchangeCurrencyRes>
            .CreatePagedListAsync(groupedResult, exchangeParams.PageNumber, exchangeParams.PageSize, cancellationToken);
    }
}