using api.DTOs.Account;
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
            FirstName = request.FirstName,
            LastName = request.LastName,
            Email = request.Email,
            UserName = request.Email.Split('@')[0],
            PhoneNumber = request.PhoneNumber,
            Country = request.Country
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

    public static Exchange ConvertCreateExchangeDtoToExchange(CreateExchangeDto request, ObjectId ownerId)
    {
        return new(
            OwnerId: ownerId,
            Name: request.Name,
            Description: request.Description,
            Type: request.Type,
            Status: ExchangeStatus.Pending,
            CreatedAt: DateTime.UtcNow
        );
    }

    public static ExchangeRes ConvertExchangeToExchangeRes(Exchange exchange, ObjectId ownerId)
    {
        return new (
            ExchangeName: exchange.Name,
            Description: exchange.Description,
            ExchangeType: exchange.Type,
            ExchangeStatus: exchange.Status,
            CreatedAt: exchange.CreatedAt
        );
    }
}