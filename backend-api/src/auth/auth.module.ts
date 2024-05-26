import { Injectable, Module, UnauthorizedException } from '@nestjs/common';
import { AuthService, TokenPayload } from './auth.service';
import { DbconnectModule } from 'src/dbconnect/dbconnect.module';
import { UserModule } from 'src/user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { PassportModule, PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Strategy as PassportLocalStrategy } from 'passport-local';
import { UserService } from 'src/user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly usersService: UserService,
  ) {
    super({
      jwtFromRequest: (request) => {
        // Check if token is present in the authorization header
        const tokenFromHeader =
          ExtractJwt.fromAuthHeaderAsBearerToken()(request);
        if (tokenFromHeader) {
          return tokenFromHeader;
        }

        // Check if token is present in the cookies
        const tokenFromCookie = request?.Authentication;
        if (tokenFromCookie) {
          return tokenFromCookie;
        }

        // If token is not found in header or cookies, return null
        return null;
      },
      secretOrKey: configService.get('SECRET_KEY'),
    });
  }

  async validate(tokenPayload: TokenPayload) {
    try {
      return await this.usersService.findOneByEmail(tokenPayload.email);
    } catch (err) {
      throw new UnauthorizedException();
    }
  }
}

@Injectable()
export class LocalStrategy extends PassportStrategy(PassportLocalStrategy) {
  constructor(private readonly usersService: UserService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string) {
    return this.usersService.validateUser(email, password);
  }
}

@Module({
  imports: [
    DbconnectModule,
    UserModule,
    PassportModule,
    ConfigModule,
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('SECRET_KEY'),
        signOptions: {
          expiresIn: `${configService.get('EXPIRE')}s`,
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
})
export class AuthModule {}
