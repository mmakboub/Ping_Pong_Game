import { Module } from '@nestjs/common';
import { SettingService } from './setting.service';
import { SettingController } from './setting.controller';
import { UsersService } from '../users/users.service';

@Module({
  imports: [],
  providers: [SettingService, UsersService],
  exports: [SettingService],
  controllers: [SettingController]
})
export class SettingModule {}