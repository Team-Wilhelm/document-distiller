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
    
    public async Task<AppUser> Login(LoginDto loginDto)
    {
       return await userRepository.Login(loginDto);
    }
}