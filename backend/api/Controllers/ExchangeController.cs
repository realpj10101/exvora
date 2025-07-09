using api.Controllers.Helpers;
using api.DTOs.Account;
using api.DTOs.ExchangeDtos;
using api.DTOs.Helpers;
using api.Extensions;
using api.Interfaces;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;

namespace api.Controllers;

public class ExchangeController(IExchangeRepository _exchangeRepository, ITokenService _tokenService) : BaseApiController
{
    [HttpPost("create-exchange")]
    public async Task<ActionResult<ExchangeRes>> CreateExchange(CreateExchangeDto request,
        CancellationToken cancellationToken)
    {
        ObjectId? userId = await _tokenService.GetActualUserIdAsync(User.GetHashedUserId(), cancellationToken);
        
        if (userId is null)
            return Unauthorized("You are not logged in. Please login again.");

        OperationResult<ExchangeRes>? opResult = await 
            _exchangeRepository.CreateExchangeAsync(request, userId, cancellationToken);

        return opResult.IsSuccess
            ? Ok(opResult.Result)
            : opResult.Error?.Code switch
            {
                ErrorCode.IsAlreadyExist => BadRequest(opResult.Error.Message),
                ErrorCode.InvalidType => BadRequest(opResult.Error.Message),
                _ => BadRequest("Creation failed. Contact administrator.")
            };
    }
}