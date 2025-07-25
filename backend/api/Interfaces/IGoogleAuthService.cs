using Google.Apis.Auth;

namespace api.Interfaces;

public interface IGoogleAuthService
{
    public Task<GoogleJsonWebSignature.Payload?> VerifyTokenAsync(string idToken);
}