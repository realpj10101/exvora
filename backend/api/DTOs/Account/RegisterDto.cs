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
    string Country,
    [DataType(DataType.Password)]
    [Length(PropLength.PasswordMinLength, PropLength.PasswordMaxLength)]
    [RegularExpression(@"^(?=.*[A-Z])(?=.*\d).+$", ErrorMessage = "Needs: 8 to 50 characters. An uppercase character(ABC). A number(123)")]
    string Password,
    [DataType(DataType.Password)]
    [Length(PropLength.PasswordMinLength, PropLength.PasswordMaxLength)]
    [RegularExpression(@"^(?=.*[A-Z])(?=.*\d).+$", ErrorMessage = "Needs: 8 to 50 characters. An uppercase character(ABC). A number(123)")]
    string ConfirmPassword
);