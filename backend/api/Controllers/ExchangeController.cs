using api.Controllers.Helpers;
using api.DTOs;
using api.DTOs.Account;
using api.DTOs.ExchangeDtos;
using api.DTOs.Helpers;
using api.Extensions;
using api.Helpers;
using api.Interfaces;
using api.Models;
using api.Models.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;

namespace api.Controllers;

[Authorize]
public class ExchangeController(IExchangeRepository _exchangeRepository, ITokenService _tokenService)
    : BaseApiController
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

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ExchangeRes>>> GetAllExchanges([FromQuery] ExchangeParams exchangeParams,
        CancellationToken cancellationToken)
    {
        ObjectId? userId = await _tokenService.GetActualUserIdAsync(User.GetHashedUserId(), cancellationToken);

        if (userId is null)
            return Unauthorized("You are not logged in. Please login again.");

        PagedList<Exchange>? pagedExchanges =
            await _exchangeRepository.GetAllExchangesAsync(exchangeParams, cancellationToken);

        if (pagedExchanges.Count == 0)
            return NoContent();

        PaginationHeader paginationHeader = new(
            CurrentPage: pagedExchanges.CurrentPage,
            ItemsPerPage: pagedExchanges.PageSize,
            TotalItems: pagedExchanges.TotalItems,
            TotalPages: pagedExchanges.TotalPages
        );
        
        Response.AddPaginationHeader(paginationHeader);

        List<ExchangeRes> exchangeDtos = [];

        foreach (Exchange exchange in pagedExchanges)
        {
            exchangeDtos.Add(Mappers.ConvertExchangeToExchangeRes(exchange));
        }

        return exchangeDtos;
    }
}