import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

import type { Payload } from '../auth.interface';
import { AuthService } from '../service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private auth: AuthService) {
    super();
  }

  public async validate(email: string, password: string): Promise<Payload> {
    const user = await this.auth.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('NotFoundUser');
    }

    return {
      userId: user._id,
      email: user.email,
    };
  }
}
