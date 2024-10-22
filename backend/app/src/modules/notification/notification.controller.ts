import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import JwtAuthGuard from '../auth/jwt-auth.guard';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @UseGuards(JwtAuthGuard)
  @Get('friend-check/:recieverId/:senderId')
  checkFriendRequest(
    @Param('recieverId') recieverId: string,
    @Param('senderId') senderId: string,
  ) {
    return this.notificationService.checkFriendRequest(senderId, recieverId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('friend-request/')
  addFriendRequest(@Body() body: { senderId: string; receiverId: string }) {
    // console.log('add friend: ', body);
    return this.notificationService.addFriendRequest(
      body.senderId,
      body.receiverId,
    );
  }
  @UseGuards(JwtAuthGuard)
  @Delete('friend-request/:senderId/:recieverId')
  DeleteFriendRequest(
    @Param('senderId') senderId: string,
    @Param('receiverId') receiverId: string,
  ) {
    // console.log('delete friend');
    return this.notificationService.DeleteFriendRequest(senderId, receiverId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('friend-request/:receiverId')
  findFriendRequest(@Param('receiverId') receiverId: string) {
    // console.log('find friend', receiverId);
    return this.notificationService.findFriendRequest(receiverId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('friend-accept/')
  acceptFriendRequest(@Body() body: { senderId: string; receiverId: string }) {
    // console.log('update friend: ', body);
    return this.notificationService.makeFriendship(
      body.senderId,
      body.receiverId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Patch('friend-reject/')
  rejectFriendRequest(@Body() body: { senderId: string; receiverId: string }) {
    // console.log('update friend: ', body);
    return this.notificationService.removeFriendRequest(
      body.senderId,
      body.receiverId,
    );
  }
}
