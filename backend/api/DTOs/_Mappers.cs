using api.DTOs.Account;
using api.DTOs.CurrencyDtos;
using api.DTOs.ExchangeDtos;
using api.Enums;
using api.Models;
using MongoDB.Bson;

namespace api.DTOs;

public static class Mappers
{
    public static AppUser ConvertRegisterDtoToAppUser(RegisterDto request)
    {
        return new AppUser
        {
            FirstName = request.FirstName.Trim().ToLower(),
            LastName = request.LastName.Trim().ToLower(),
            Email = request.Email.Trim().ToLower(),
            UserName = request.Email.Split('@')[0],
            PhoneNumber = request.PhoneNumber.Trim().ToLower(),
            Country = request.Country.Trim().ToLower()
        };
    }

    public static LoggedInDto ConvertAppUserToLoggedInDto(AppUser appUser, string tokenValue)
    {
        return new LoggedInDto
        {
            Token = tokenValue,
            FirstName = appUser.FirstName,
        };
    }

    public static Exchange? ConvertCreateExchangeDtoToExchange(CreateExchangeDto request, ObjectId? ownerId)
    {
        ExchangeType exchangeTypeEnum;

        if (Enum.TryParse<ExchangeType>(request.Type.Trim(), true, out var exchangeType))
        {
            exchangeTypeEnum = exchangeType;
        }
        else
        {
            return null;
        }

        return new(
            OwnerId: ownerId,
            Name: request.Name.ToLower().Trim(),
            Description: request.Description.ToLower().Trim(),
            Type: exchangeTypeEnum,
            Status: ExchangeStatus.Pending,
            CreatedAt: DateTime.UtcNow
        );
    }

    public static ExchangeRes ConvertExchangeToExchangeRes(Exchange exchange)
    {
        return new(
            ExchangeName: exchange.Name.Trim().ToLower(),
            Description: exchange.Description.Trim().ToLower(),
            ExchangeType: exchange.Type,
            ExchangeStatus: exchange.Status,
            CreatedAt: exchange.CreatedAt
        );
    }

    public static Currency? ConvertAddCurrencyToCurrency(AddCurrencyDto request)
    {
        CurrencyStatus currencyStatusEnum;
        CurrencyType currencyTypeEnum;

        if (Enum.TryParse<CurrencyType>(request.Category.Trim(), true, out var category))
        {
            currencyTypeEnum = category;
        }
        else
        {
            return null;
        }

        if (Enum.TryParse<CurrencyStatus>(request.Status.Trim(), true, out var status))
        {
            currencyStatusEnum = status;
        }
        else
        {
            return null;
        }

        return new Currency(
            Symbol: request.Symbol.Trim().ToLower(),
            FullName: request.FullName.Trim().ToLower(),
            CurrencyPrice: request.CurrencyPrice,
            MarketCap: request.MarketCap,
            Category: currencyTypeEnum,
            Status: currencyStatusEnum
        );
    }
}