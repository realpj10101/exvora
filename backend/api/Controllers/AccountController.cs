using api.Controllers.Helpers;
using api.DTOs.Account;
using api.DTOs.Helpers;
using api.Extensions;
using api.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers;

[Authorize]
public class AccountController(IAccountRepository _accountRepository) : BaseApiController
{
    [AllowAnonymous]
    [HttpPost("register")]
    public async Task<ActionResult<LoggedInDto>> Register(RegisterDto userInput, CancellationToken cancellationToken)
    {
        OperationResult<LoggedInDto> opResult =
            await _accountRepository.RegisterAsync(userInput, cancellationToken);

        return opResult.IsSuccess
            ? Ok(opResult.Result)
            : opResult.Error?.Code switch
            {
                ErrorCode.NetIdentityFailed => BadRequest(opResult.Error.Message),
                ErrorCode.IsAccountCreationFailed => BadRequest(opResult.Error.Message),
                _ => BadRequest("Account creation failed! Try again or contact administrator.")
            };
    }

    [AllowAnonymous]
    [HttpPost("login")]
    public async Task<ActionResult<LoggedInDto>> Login(LoginDto userInput, CancellationToken cancellationToken)
    {
        OperationResult<LoggedInDto>? opResult = await _accountRepository.LoginAsync(userInput, cancellationToken);

        return opResult.IsSuccess
            ? Ok(opResult.Result)
            : opResult.Error?.Code switch
            {
                ErrorCode.IsNotFound => BadRequest(opResult.Error.Message),
                ErrorCode.IsFailed => BadRequest(opResult.Error.Message),
                _ => BadRequest("Login failed! Try again or contact the suppport.")
            };
    }

    [HttpGet]
    public async Task<ActionResult<LoggedInDto>> ReloadLoggedInUser(CancellationToken cancellationToken)
    {
        // obtain token value
        string? token = null;

        bool isTokenValid = HttpContext.Request.Headers.TryGetValue("Authorization", out var authHeader);

        if (isTokenValid)
            token = authHeader.ToString().Split(' ').Last();

        if (string.IsNullOrEmpty(token))
            return Unauthorized("Token is expired or invalid. Login again.");

        // obtain userId
        string? hashedUserId = User.GetHashedUserId();
        if (string.IsNullOrEmpty(hashedUserId))
            return BadRequest("No user found with this user Id");

        // get loggedInDto
        LoggedInDto? loggedInDto =
            await _accountRepository.ReloadLoggedInUserAsync(hashedUserId, token, cancellationToken);

        return loggedInDto is null ? Unauthorized("User is logged out or unauthorized. Login again") : loggedInDto;
    }

    [AllowAnonymous]
    [HttpPost("external-login")]
    public async Task<ActionResult<LoggedInDto>> ExternalLogin(ExternalAuthDto request,
        CancellationToken cancellationToken)
    {
        OperationResult<LoggedInDto> opResult = await _accountRepository.ExternalLoginAsync(request, cancellationToken);

        return opResult.IsSuccess
            ? Ok(opResult.Result)
            : opResult.Error?.Code switch
            {
                ErrorCode.IsFailed => BadRequest(opResult.Error.Message),
                ErrorCode.EmailFailed => BadRequest(opResult.Error.Message),
                ErrorCode.NetIdentityFailed => BadRequest(opResult.Error.Message),
                ErrorCode.TokenCreationFailed => BadRequest(opResult.Error.Message),
                _ => BadRequest("External login failed! Try again or contact administrator.")
            };
    }
}