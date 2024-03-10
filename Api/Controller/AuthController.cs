using Core.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Shared.Dtos;
using Shared.Models;
using Shared.Responses;

namespace VirtualFriend.Controller;

/**
 * Handles authentication
 */
[ApiController]
[Route("[controller]")]
public class AuthController(AuthService authService, JwtService jwtService, UserManager<AppUser> userManager) : ControllerBase
{
    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterDto registerDto)
    {
       await authService.Register(registerDto);
       return Ok();
    }
    
    [HttpPost("login")]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(AuthResponse))]
    public async Task<IActionResult> Login(LoginDto loginDto)
    {
        var user = await authService.Login(loginDto);
        var roles = await userManager.GetRolesAsync(user);
        var token = jwtService.GenerateJwtToken(user, roles, null);
        return Ok(new AuthResponse { Email = user.Email!, Token = token });
    }
}