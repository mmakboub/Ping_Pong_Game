import { Module } from '@nestjs/common';
import { MyGateway } from './gateway/chat.gateway';
import { ChatService } from './services/chat.service';

@Module({
  imports: [],
  providers: [MyGateway, ChatService],
})
export class ChatModule {}
