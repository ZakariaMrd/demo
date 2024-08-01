import { Controller, Post, Body, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { Unprotected, Public } from 'nest-keycloak-connect';
import { LoginParamsDto } from '../dtos/login-params.dto';
import { RefreshTokenParamsDto } from '../dtos/refresh-token-params.dto';
import { TokenIntrospectDto } from '../dtos/token-introspect.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('login')
  @Public()
  async login(@Body() loginParamsDto: LoginParamsDto) {
    try {
      return await this.authService.getAccessToken(loginParamsDto);
    } catch (error) {
      if (error?.response?.status === 401) {
        throw new UnauthorizedException("Invalid User Credentials")
      }
      else {
        throw error
      }
    }
  }

  @Post('logout')
  async logout(@Body() refreshTokenParamsDto: RefreshTokenParamsDto) {
    return await this.authService.logout(refreshTokenParamsDto);
  }

  @Post('refreshToken')
  async refreshAccessToken(@Body() refreshTokenParamsDto: RefreshTokenParamsDto) {
    return await this.authService.refreshAccessToken(refreshTokenParamsDto);
  }

  @Post('isLoggedIn')
  @Public()
  async isLoggedIn(@Body() tokenIntrospectDto: TokenIntrospectDto) {
    return await this.authService.isLoggedIn(tokenIntrospectDto);
  }
}
