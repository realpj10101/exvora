using System.Text.Json.Serialization;
using api.Extensions;
using api.Hubs;
using api.Interfaces;
using api.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

var name = typeof(string);

builder.Services.AddControllers()
    .AddJsonOptions(options => { options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter()); });

builder.Services.AddApplicationService(builder.Configuration);
builder.Services.AddIdentityService(builder.Configuration);
builder.Services.AddRepositoryServices();
builder.Services.AddOpenApi();
builder.Services.AddHostedService<PriceBroadcastService>();

builder.Services.AddSignalR();

builder.Services.AddHttpClient<ICoinPriceSource, CoinGeckoSource>(c =>  
{
    c.BaseAddress = new Uri("https://api.coingecko.com/api/v3/");
});

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("admin", policy =>
        policy.RequireRole("admin"));
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwaggerUI(options =>
        {
            options.SwaggerEndpoint("/openapi/v1.json", "Exvora");
        }
    );
}

// Configure the HTTP request pipeline.

app.UseRouting();

app.UseStaticFiles();

app.UseCors();

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.MapHub<PriceHub>("/hubs/prices");

app.Run();