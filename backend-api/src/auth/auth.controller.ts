import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import LocalAuthGuard from 'src/local-auth/local-auth.guard';
import { User } from 'src/user/entities/user.entity';
import { Response } from 'express';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Body() user: CreateUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    await this.authService.login(user, response);
    response.json({ ...user });
  }
  @Post('register')
  async register(
    @Body() CreateUserDto: CreateUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    return await this.authService.register(CreateUserDto, response);
  }
}
