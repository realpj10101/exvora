// using api.Models;

using api.Models;

namespace api.Extensions;

public class AppVariablesExtensions
{
    public const string TokenKey = "TokenKey";

    public const string CollectionUsers = "users";
    public const string CollectionExchanges = "exchanges";
    public const string CollectionCurrencies = "currencies";
    public const string CollectionExchangeCurrencies = "exchangeCurrencies";

    public readonly static string[] AppVersion = ["1", "1.0.2"];

    public readonly static AppRole[] roles = [
        new() {Name = Roles.admin.ToString()},
        new() {Name = Roles.member.ToString()}
    ];
}

public enum Roles
{
    admin, 
    member
}
