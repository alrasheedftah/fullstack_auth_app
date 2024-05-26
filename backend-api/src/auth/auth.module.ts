import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { DbconnectModule } from 'src/dbconnect/dbconnect.module';
import { UserModule } from 'src/user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from 'src/strategies/LocalStrategy';
import { JwtStrategy } from 'src/strategies/JwtStrategy';

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
