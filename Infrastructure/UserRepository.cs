using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Shared.Dtos;
using Shared.Exceptions;
using Shared.Models;

namespace Infrastructure;

public class UserRepository(UserManager<AppUser> userManager)
{
    public async Task CreateUser(RegisterDto registerDto)
    {
        var user = new AppUser
        {
            UserName = registerDto.Email,
            Email = registerDto.Email
        };
        var result = await userManager.CreateAsync(user, registerDto.Password);
        if (!result.Succeeded)
        {
            throw new AuthException("User creation failed");
        }
    }

    public async Task<AppUser> GetUser(Guid userId)
    {
        var user = await userManager.Users.FirstOrDefaultAsync(u => u.Id == userId);
        if (user == null)
        {
            throw new NotFoundException("User not found");
        }
        return user;
    }
    
    public async Task GetAllUsers() {}

    public async Task Login(LoginDto loginDto)
    {
        var user = await userManager.Users.FirstOrDefaultAsync(u => u.UserName == loginDto.Email);
        if (user == null)
        {
            throw new AuthException("Wrong username or password");
        }
        
        var result = await userManager.CheckPasswordAsync(user, loginDto.Password);
        if (!result)
        {
            throw new AuthException("Wrong username or password");
        }
    }
}