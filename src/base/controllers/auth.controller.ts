import {
  Controller,
  Get,
  Post,
  UseGuards,
  Body,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import { ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';

import {
  AuthService,
  JwtAuthGuard,
  LocalAuthGuard,
  Payload,
  LoginUserDto,
  LoginUserResultDto,
  RegisterUserDto,
} from '@/modules/auth';
import { ReqUser } from '@/common';
import { RegisterInterceptor } from '@/common/interceptors/register.interceptor';
import { UserEntity } from '@/modules/user/schemas';

const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;

/**
 * https://docs.nestjs.com/techniques/authentication
 */
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  public async login(
    @Body() loginDto: LoginUserDto,
      @Res({ passthrough: true }) res: Response,
  ): Promise<LoginUserResultDto> {
    const data = await this.authService.login(loginDto);
    res.cookie('tk', data.accessToken, {
      maxAge: THIRTY_DAYS,
      httpOnly: false,
      secure: false,
      sameSite: 'none',
    });

    return data;
  }

  @UseInterceptors(RegisterInterceptor<UserEntity>)
  @Post('register')
  public async register(
    @Body() registerDto: RegisterUserDto,
  ): Promise<UserEntity> {
    const result = await this.authService.register(registerDto);

    return result;
  }

  @Post('check')
  @UseGuards(JwtAuthGuard)
  public check(@ReqUser() user: Payload): Payload | undefined {
    return user;
  }

  @Post('me')
  @UseGuards(JwtAuthGuard)
  public getMe(@ReqUser() user: Payload): Payload | undefined {
    return user;
  }

  @ApiExcludeEndpoint()
  @UseGuards(JwtAuthGuard)
  @Get('jwt/check')
  public jwtCheck(@ReqUser() user: Payload): Payload | undefined {
    return user;
  }
}
