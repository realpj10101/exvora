using api.DTOs.CurrencyDtos;
using api.Enums;
using api.Extensions;
using api.Hubs;
using api.Interfaces;
using api.Models;
using api.Settings;
using Microsoft.AspNetCore.SignalR;
using MongoDB.Driver;

namespace api.Services;

public class PriceBroadcastService : BackgroundService
{
    private readonly IHubContext<PriceHub> _hub;
    private readonly IMongoCollection<Currency> _collection;
    private readonly ICoinPriceSource _source;
    private readonly TimeSpan _interval;

    public PriceBroadcastService(
        IHubContext<PriceHub> hub,
        IMongoClient client,
        IMyMongoDbSettings db,
        ICoinPriceSource source,
        IConfiguration config
    )
    {
        _hub = hub;
        _source = source;
        _collection = client.GetDatabase(db.DatabaseName)
            .GetCollection<Currency>(AppVariablesExtensions.CollectionCurrencies);

        var seconds = config.GetValue<int?>("Prices:PollSeconds") ?? 15;
        _interval = TimeSpan.FromSeconds(seconds);
    }

    protected async override Task ExecuteAsync(CancellationToken cancellationToken)
    {
        while (!cancellationToken.IsCancellationRequested)
        {
            try
            {
                var feedCurrencies = await _collection
                    .Find(cur =>
                        cur.Status == CurrencyStatus.Active && cur.FeedProvider == "coingecko" && cur.FeedId != null)
                    .ToListAsync(cancellationToken);

                if (feedCurrencies.Count > 0)
                {
                    var pairs = feedCurrencies.Select(currency => (id: currency.FeedId!, vs: currency.Quote))
                        .ToList();
                    var prices = await _source.GetAsync(pairs, cancellationToken);

                    foreach (var currency in feedCurrencies)
                    {
                        if (prices.TryGetValue((currency.FeedId!, currency.Quote), out var pair))
                        {
                            var update = Builders<Currency>.Update
                                .Set(cur => cur.CurrencyPrice, pair.price)
                                .Set(cur => cur.UpdatedAtUtc, DateTime.UtcNow);

                            await _collection.UpdateOneAsync(cur => cur.Id == currency.Id, update, null, cancellationToken);

                            var payload = new CurrencyResponse(
                                Symbol: currency.Symbol,
                                FullName: currency.FullName,
                                Price: pair.price,
                                MarketCap: currency.MarketCap,
                                Category: currency.Category,
                                Status: currency.Status,
                                FeedProvider: currency.FeedProvider,
                                FeedId: currency.FeedId,
                                Quote: currency.Quote,
                                UpdatedAtUtc: DateTime.UtcNow
                            );

                            await _hub.Clients.All.SendAsync("price", payload, cancellationToken);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine(ex);
            }

            await Task.Delay(_interval, cancellationToken);
        }
    }
}