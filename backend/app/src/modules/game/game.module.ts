import { Module } from '@nestjs/common';
import { GameGateway } from './game.gateway';
import { GameService } from './game.sevice';

@Module({
  imports: [],
  controllers: [],
  providers: [GameGateway, GameService],
})
export class GameModule {}
