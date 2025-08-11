using System.Text.Json;
using api.Interfaces;

namespace api.Services;

public class CoinGeckoSource : ICoinPriceSource
{
    private readonly HttpClient _http;

    public CoinGeckoSource(HttpClient http)
    {
        _http = http;
        if (_http.BaseAddress is null)
            _http.BaseAddress = new Uri("https://api.coingecko.com/api/v3/");
    }
    
    public async Task<Dictionary<(string id, string vs), (decimal price, decimal? change)>> GetAsync(IEnumerable<(string id, string vs)> pairs, CancellationToken cancellationToken)
    {
        var ids = string.Join(',', pairs.Select(p => p.id).Distinct());
        var vs  = string.Join(',', pairs.Select(p => p.vs).Distinct());
        
        var url = $"simple/price?ids={ids}&vs_currencies={vs}&include_24hr_change=true";

        using var res = await _http.GetAsync(url, cancellationToken);
        
        res.EnsureSuccessStatusCode();
        
        using var doc = await JsonDocument.ParseAsync(await res.Content.ReadAsStreamAsync(cancellationToken),
            cancellationToken: cancellationToken);

        var map = new Dictionary<(string, string), (decimal, decimal?)>();
        
        foreach (var coin in doc.RootElement.EnumerateObject())
        {
            var id = coin.Name;

            foreach (var prop in coin.Value.EnumerateObject())
            {
                var name = prop.Name.ToLower();

                if (!name.EndsWith("_24h_change") && prop.Value.ValueKind == JsonValueKind.Number)
                {
                    var vsCur = name;
                    var price = prop.Value.GetDecimal();
                    
                    decimal? change = null;
                    
                    var changeProp = $"{vsCur}_24h_change";
                    if (coin.Value.TryGetProperty(changeProp, out var ch) && ch.ValueKind == JsonValueKind.Number)
                        change = ch.GetDecimal();

                    map[(id, vsCur)] = (price, change);
                }
            }
        }

        return map;
    }
}