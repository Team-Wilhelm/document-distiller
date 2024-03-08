using Core.Services;
using Microsoft.AspNetCore.Mvc;
using Shared.Dtos;

namespace VirtualFriend.Controller;

/**
 * Handles authentication
 */
[ApiController]
[Route("[controller]")]
public class AuthController(AuthService authService) : ControllerBase
{
    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterDto registerDto)
    {
       await authService.Register(registerDto);
       return Ok();
    }
    
    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginDto loginDto)
    {
        await authService.Login(loginDto);
        return Ok();
    }
}