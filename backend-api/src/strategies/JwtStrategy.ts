import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { UserService } from 'src/user/user.service';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TokenPayload } from 'src/auth/auth.service';
import { SECRET_KEY_KEY_NAME } from 'src/auth/utiles';

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
      secretOrKey: configService.get(`${SECRET_KEY_KEY_NAME}`),
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
