using System.ComponentModel.DataAnnotations;

namespace api.DTOs.Account;

public record RegisterDto(
    [Length(PropLength.UserNameMinLength, PropLength.UserNameMaxLength)]
    string FirstName,
    [Length(PropLength.UserNameMinLength, PropLength.UserNameMaxLength)]
    string LastName,
    [MaxLength(PropLength.EmailMaxLength), RegularExpression(@"^[^@\s]+@[^@\s]+\.[^@\s]+$")]
    string Email,
    string PhoneNumber,
    string Country
);