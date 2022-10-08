import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import _ from 'lodash';
import { ExtractJwt, Strategy } from 'passport-jwt';

import type { JwtPayload, Payload } from '../auth.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService) {
    super({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get('jwtSecret'),
    });
  }

  public validate(payload: JwtPayload): Partial<Payload> {
    return { userId: payload.userId, ..._.pick(payload, ['email']) };
  }
}
