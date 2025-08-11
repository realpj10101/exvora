namespace api.Interfaces;

public interface ICoinPriceSource
{
    // key: (id, vs): (price, 24hChange?)
    public Task<Dictionary<(string id, string vs), (decimal price, decimal? change)>> 
        GetAsync(IEnumerable<(string id, string vs)> pairs, CancellationToken cancellationToken);
}