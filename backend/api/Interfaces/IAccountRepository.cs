using api.DTOs.Account;
using api.DTOs.Helpers;
using MongoDB.Driver;

namespace api.Interfaces;

public interface IAccountRepository
{
    public Task<OperationResult<LoggedInDto>> RegisterAsync(RegisterDto request, CancellationToken cancellationToken );
    public Task<OperationResult<LoggedInDto>> LoginAsync(LoginDto request, CancellationToken cancellationToken );
    public Task<LoggedInDto?> ReloadLoggedInUserAsync(string hashedUserId, string token, CancellationToken cancellationToken );
}