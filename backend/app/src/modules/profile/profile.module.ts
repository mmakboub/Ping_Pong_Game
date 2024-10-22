import { Module } from '@nestjs/common';
import { ProfileService } from './services/profile.service';
import { ProfileController } from './controllers/profile.controller';
// import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [],
  controllers: [ProfileController],
  providers: [ProfileService],
})
export class ProfileModule {}
