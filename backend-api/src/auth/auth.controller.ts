import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import LocalAuthGuard from 'src/local-auth/local-auth.guard';
import { Response } from 'express';
import { SignInUserDto } from 'src/user/dto/SignInUserDto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @UseGuards(LocalAuthGuard)
  @Post('sign-in')
  async signIn(
    @Body() user: SignInUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const token = await this.authService.login(user, response);
    response.json({ ...token });
  }

  @Post('sign-up')
  async signUp(
    @Body() CreateUserDto: CreateUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    return await this.authService.register(CreateUserDto, response);
  }

  @Post('sign-out')
  async Signout(@Res({ passthrough: true }) response: Response) {
    await this.authService.signout(response);
    response.json({ message: 'logout Sucess' }); // Todo redirect Path
  }
}
