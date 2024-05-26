import { PartialType } from '@nestjs/mapped-types';
import { IsString, MinLength } from 'class-validator';
import { SignInUserDto } from './SignInUserDto';

export class CreateUserDto extends PartialType(SignInUserDto) {
  @IsString()
  @MinLength(3)
  username: string;
}
