namespace Shared.Exceptions;

public class AuthException : AppException
{
    public AuthException(string message) : base(message)
    {
    }
    
    public AuthException(string message, Exception innerException) : base(message, innerException)
    {
    }
    
    public AuthException()
    {}
}