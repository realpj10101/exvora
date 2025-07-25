namespace api.DTOs.Account;

public record ExternalAuthDto(
    string Provider,
    string IdToken
);