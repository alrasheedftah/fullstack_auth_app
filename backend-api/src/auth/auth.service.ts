import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { UserService } from 'src/user/user.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { SignInUserDto } from 'src/user/dto/SignInUserDto';
import { AUTHENTICATION_KEY_NAME, EXPIRE_KEY_NAME } from './utiles';

export type TokenPayload = {
  email: string;
};

export type TokenResponse = {
  email: string;
  token: string;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private usersService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async login(user: SignInUserDto, response: Response): Promise<TokenResponse> {
    const tokenPayload: TokenPayload = {
      email: user.email,
    };

    const expires = new Date();
    expires.setSeconds(
      expires.getSeconds() + this.configService.get(`${EXPIRE_KEY_NAME}`),
    );

    const token = this.jwtService.sign(tokenPayload);
    response.cookie(`${AUTHENTICATION_KEY_NAME}`, token, {
      httpOnly: true,
      expires,
    });

    return { email: user.email, token: token };
  }

  async register(registerReq: CreateUserDto, response: Response) {
    const user = await this.usersService.create(registerReq);
    return this.login(registerReq as SignInUserDto, response);
  }

  signout(response: Response) {
    response.cookie(`${AUTHENTICATION_KEY_NAME}`, '', {
      httpOnly: true,
      expires: new Date(),
    });
  }
}
