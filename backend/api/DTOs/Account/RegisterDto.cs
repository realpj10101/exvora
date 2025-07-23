using System.ComponentModel.DataAnnotations;

namespace api.DTOs.Account;

public record RegisterDto(
    [Length(PropLength.UserNameMinLength, PropLength.UserNameMaxLength)]
    string FirstName,
    [Length(PropLength.UserNameMinLength, PropLength.UserNameMaxLength)]
    string LastName,
    [MaxLength(PropLength.EmailMaxLength), RegularExpression(@"^[^@\s]+@[^@\s]+\.[^@\s]+$")]
    string Email,
    [RegularExpression(@"^(\+?\d{1,4}[\s-]?)?(\(?\d{2,4}\)?[\s-]?)?\d{3,4}[\s-]?\d{4}$", ErrorMessage = "Invalid phone number format")]
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