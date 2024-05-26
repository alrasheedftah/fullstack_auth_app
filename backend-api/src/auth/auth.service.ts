import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { UserService } from 'src/user/user.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

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

  async login(user: CreateUserDto, response: Response) : Promise<TokenResponse> {
    const tokenPayload: TokenPayload = {
      email: user.email,
    };

    const expires = new Date();
    expires.setSeconds(expires.getSeconds() + this.configService.get('EXPIRE'));

    const token = this.jwtService.sign(tokenPayload);
    response.cookie('Authentication', token, {
      httpOnly: true,
      expires,
    });

    return { email: user.email, token: token };
  }

  async register(registerReq: CreateUserDto, response: Response) {
    const user = await this.usersService.create(registerReq);
    this.login(registerReq, response);
  }

  signout(response: Response) {
    response.cookie('Authentication', '', {
      httpOnly: true,
      expires: new Date(),
    });
  }
}
