using System.Security.Claims;

namespace api.Extensions;

public static class ClaimPrincipalExtensions
{
   public static string? GetHashedUserId(this ClaimsPrincipal user)
   {
        return user.FindFirstValue(ClaimTypes.NameIdentifier);
   }
}
