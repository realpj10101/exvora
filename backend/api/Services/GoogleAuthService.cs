using api.Interfaces;
using Google.Apis.Auth;

namespace api.Services;

public class GoogleAuthService : IGoogleAuthService
{
    public async Task<GoogleJsonWebSignature.Payload?> VerifyTokenAsync(string idToken)
    {
        try
        {
            var settings = new GoogleJsonWebSignature.ValidationSettings
            {
                Audience = new[] { "your-client-id.apps.googleusercontent.com" }
            };
            
            var payload = await GoogleJsonWebSignature.ValidateAsync(idToken, settings);
            return payload;
        }
        catch
        {
            return null;
        }
    }
}