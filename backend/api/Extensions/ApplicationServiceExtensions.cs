using api.Settings;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace api.Extensions;

public static class ApplicationServiceExtensions
{
    public static IServiceCollection AddApplicationService(this IServiceCollection services, IConfiguration configuration)
    {
        #region MongoDbSettings
        ///// get values from this file: appsettings.Development.json /////
        // get section
        services.Configure<MyMongoDbSettings>(configuration.GetSection(nameof(MyMongoDbSettings)));

        // get values
        services.AddSingleton<IMyMongoDbSettings>(serviceProvider =>
        serviceProvider.GetRequiredService<IOptions<MyMongoDbSettings>>().Value);

        // get connectionString to the db
        services.AddSingleton<IMongoClient>(serviceProvider =>
        {
            MyMongoDbSettings uri = serviceProvider.GetRequiredService<IOptions<MyMongoDbSettings>>().Value;

            return new MongoClient(uri.ConnectionString);
        });
        #endregion MongoDbSettings

        #region Cors: baraye ta'eede Angular HttpClient requests
        services.AddCors(options =>
            {
                options.AddDefaultPolicy(policy =>
                    policy.AllowAnyHeader().AllowAnyMethod().AllowCredentials().WithOrigins("http://localhost:4200").WithExposedHeaders("Pagination"));
            });
        #endregion Cors

        return services;
    }
}
