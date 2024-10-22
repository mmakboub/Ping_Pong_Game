import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { ProfileModule } from './modules/profile/profile.module';
import { GameModule } from './modules/game/game.module';
import { ConfigModule } from '@nestjs/config';
import * as Joi from '@hapi/joi';

import { AuthModule } from './modules/auth/auth.module';
import { ChatController } from './modules/chat/controllers/chat.controller';
import { ChatService } from './modules/chat/services/chat.service';
import { ChatModule } from './modules/chat/chat.module';
import { TfaModule } from './modules/auth/tfa/tfa.module';
import { SettingModule } from './modules/Setting/setting.module';
import { NotificationGateway } from './modules/notification/notification.gateway';
import { NotificationController } from './modules/notification/notification.controller';
import { NotificationService } from './modules/notification/notification.service';
import { PrismaModule } from './modules/prisma/prisma.module';
import { OnlineStatusGateway } from './modules/online-status/online-status.gateway';

@Module({
  imports: [
    AuthModule,
    SettingModule,
    GameModule,
    ProfileModule,
    ChatModule,
    AuthModule,
    TfaModule,
    UsersModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        //game
        SERVER_PORT: Joi.number().required(),
        WEBSOCKET_PORT: Joi.number().required(),
        CORS_URL: Joi.string().required(),
        //jwt
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRATION_TIME: Joi.string().required(),
        //42auth
        UID: Joi.string().required(),
        SECRET: Joi.string().required(),
        CALLBACK_URL: Joi.string().required(),
      }),
    }),
    PrismaModule,
  ],
  controllers: [ChatController, NotificationController],
  providers: [
    ChatService,
    NotificationGateway,
    NotificationService,
    OnlineStatusGateway,
  ],
})
export class AppModule {}
