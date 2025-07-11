using api.Controllers.Helpers;
using api.DTOs.Account;
using api.DTOs.CurrencyDtos;
using api.DTOs.Helpers;
using api.Extensions;
using api.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;

namespace api.Controllers;

[Authorize]
public class CurrencyController(ICurrencyRepository _currencyRepository, ITokenService _tokenService)
    : BaseApiController
{
    [Authorize(Roles = "admin")]
    [HttpPost("add-currency")]
    public async Task<ActionResult<CurrencyResponse>> AddCurrency(AddCurrencyDto request,
        CancellationToken cancellationToken)
    {
        ObjectId? userId = await _tokenService.GetActualUserIdAsync(User.GetHashedUserId(), cancellationToken);

        if (userId is null)
            return Unauthorized("You are not logged in, Please login again.");

        OperationResult<CurrencyResponse> opResult =
            await _currencyRepository.AddCurrencyAsync(request, cancellationToken);

        return opResult.IsSuccess
            ? Ok(opResult.Result)
            : opResult.Error?.Code switch
            {
                ErrorCode.DuplicateCurrency => BadRequest(opResult.Error.Message),
                ErrorCode.InvalidType => BadRequest(opResult.Error.Message),
                _ => BadRequest("Creation failed. Contact administrator")
            };
    }
}