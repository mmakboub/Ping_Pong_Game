import { Module } from '@nestjs/common';
import { TfaController } from './tfa.controller';
import { TfaService } from './tfa.service';
import { PrismaModule } from 'src/modules/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { UsersService } from 'src/modules/users/users.service';
import { AuthService } from '../auth.service';
import { JwtStrategy } from '../jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (ConfigService: ConfigService) => ({
        secret: ConfigService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: `${ConfigService.get('JWT_EXPIRATION_TIME')}s`,
        },
      }),
    }),
    PrismaModule,
  ],
  controllers: [TfaController],
  providers: [TfaService, UsersService, JwtStrategy, AuthService],
  exports: [TfaService],
})
export class TfaModule { }
