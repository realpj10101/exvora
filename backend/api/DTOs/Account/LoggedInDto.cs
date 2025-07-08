namespace api.DTOs.Account;

public class LoggedInDto
{
    public string? Token { get; init; }
    public string? FirstName { get; init; }
    public bool IsWrongCreds { get; init; }
    public List<string> Errors { get; init; } = [];
    public string? ProfilePhotoUrl { get; init; }
}