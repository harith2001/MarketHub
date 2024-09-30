using Microsoft.AspNetCore.Identity;  

public static class PasswordHasherUtil
{
    private static PasswordHasher<object> _passwordHasher = new PasswordHasher<object>();

    //hash the password
    public static string HashPassword(string password)
    {
        return _passwordHasher.HashPassword(null, password);
    }

    //verify the password
    public static bool PasswordVerification (string hashedPassword, string providedPassword)
    {
        var result = _passwordHasher.VerifyHashedPassword(null, hashedPassword, providedPassword);
        return result == PasswordVerificationResult.Success;
    }
}