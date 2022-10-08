import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import {
  LoginUserDto,
  LoginUserResultDto,
  RegisterUserDto,
} from '../dto';

import {
  UserService,
  UserEntity,
} from '@/modules/user';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  public async register(registerUserDto: RegisterUserDto): Promise<UserEntity> {
    if (registerUserDto.password !== registerUserDto.passwordToConfirm) {
      throw new BadRequestException(
        'password_not_equal',
        'Passwords do not match.',
      );
    }

    const { passwordToConfirm, ...user } = registerUserDto;

    return this.userService.create(user);
  }

  public async login(loginDto: LoginUserDto): Promise<LoginUserResultDto> {
    const { email, password } = loginDto;
    const user = await this.validateUser(email, password);
    if (!user) {
      throw new BadRequestException(
        'username_or_password_incorrect',
        'The username or password is incorrect',
      );
    }

    return this.signUserAccessToken(user);
  }

  public async validateUser(
    email: string,
    password: string,
  ): Promise<UserEntity | null> {
    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new BadRequestException('user_not_found');
    }

    if (!user.password) {
      throw new BadRequestException('password_not_correct');
    }

    if (await bcrypt.compare(password, user.password)) {
      return user;
    }

    return null;
  }

  public signUserAccessToken(user: UserEntity): LoginUserResultDto {
    return {
      accessToken: this.jwtService.sign({
        userId: user._id,
        email: user.email,
      }),
    };
  }
}



