using api.Controllers.Helpers;
using api.DTOs;
using api.DTOs.Account;
using api.DTOs.ExchangeCurrencyDtos;
using api.DTOs.Helpers;
using api.Extensions;
using api.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;

namespace api.Controllers;

[Authorize]
public class ExchangeCurrencyController(
    IExchangeCurrencyRepository _exchangeCurrencyRepository,
    ITokenService _tokenService) : BaseApiController
{
    [HttpPost("add-currency/{exchangeName}")]
    public async Task<ActionResult> AddExchangeCurrency(AddExCurrency request, string exchangeName,
        CancellationToken cancellationToken)
    {
        ObjectId? userId = await _tokenService.GetActualUserIdAsync(User.GetHashedUserId(), cancellationToken);

        if (userId is null)
            return Unauthorized("You are not logged in. Please login again.");

        OperationResult opResult =
            await _exchangeCurrencyRepository.AddExchangeCurrencyAsync(request, exchangeName, cancellationToken);

        return opResult.IsSuccess
            ? Ok(new Response(Message: $"You add {request.Symbol} to {exchangeName} successfully."))
            : opResult.Error?.Code switch
            {
                ErrorCode.IsAlreadyExist => BadRequest(opResult.Error.Message),
                ErrorCode.IsExchangeNotFound => NotFound(opResult.Error.Message),
                ErrorCode.IsCurrencyNotFound => NotFound(opResult.Error.Message),
                ErrorCode.IsApproved => BadRequest(opResult.Error.Message),
                _ => BadRequest("Operation failed. Try again later or contact support.")
            };
    }
}