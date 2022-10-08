import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { HttpModule } from '@nestjs/axios';

import { AuthService } from './service';
import { AuthSerializer } from './auth.serializer';
import { LocalStrategy, JwtStrategy } from './strategy';

import { UserModule } from '@/modules/user';
import { ConfigService } from '@/common';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        secret: config.get('jwtSecret'),
        signOptions: { expiresIn: '7d' },
      }),
      inject: [ConfigService],
    }),
    HttpModule,
    forwardRef(() => UserModule),
  ],
  providers: [
    AuthService,
    AuthSerializer,
    LocalStrategy,
    JwtStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}
