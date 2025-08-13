using api.Interfaces;
using api.Repositories;
using api.Services;

namespace api.Extensions;

public static class RepositoryServiceExtensions
{
    public static IServiceCollection AddRepositoryServices(this IServiceCollection services)
    {
        services.AddScoped<ITokenService, TokenService>();
        services.AddScoped<IAccountRepository, AccountRepository>();
        services.AddScoped<IExchangeRepository, ExchangeRepository>();
        services.AddScoped<ICurrencyRepository, CurrencyRepository>();
        services.AddScoped<IExchangeCurrencyRepository, ExchangeCurrencyRepository>();
        services.AddScoped<IGoogleAuthService, GoogleAuthService>();

        return services;
    }
}