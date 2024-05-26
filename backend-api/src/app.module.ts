import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { DbconnectModule } from './dbconnect/dbconnect.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        SECRET_KEY: Joi.string().required(),
        EXPIRE: Joi.string().required(),
        MONGODB_URI: Joi.string().required(),
        PORT: Joi.string().required(),
      }),
    }),
    UserModule,
    DbconnectModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
