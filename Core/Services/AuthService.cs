using Infrastructure;
using Shared.Dtos;
using Shared.Models;

namespace Core.Services;

public class AuthService(UserRepository userRepository)
{
    public async Task Register(RegisterDto registerDto)
    {
        await userRepository.CreateUser(registerDto);
    }
    
    public async Task Login(LoginDto loginDto)
    {
        await userRepository.Login(loginDto);
    }
}