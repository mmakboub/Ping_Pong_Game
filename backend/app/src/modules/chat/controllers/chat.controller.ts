import {
  Controller,
  Get,
  Param,
  UseGuards,
  Req,
  Post,
  Body,
  Res,
  Patch,
} from '@nestjs/common';
import { Response } from 'express';
import { ChatService } from '../services/chat.service';
import JwtAuthGuard from 'src/modules/auth/jwt-auth.guard';
import RequestWithUser from 'src/modules/auth/requestWithUser.interface';
import { MsgDto } from '../dto/msg.dto';
import { RoomDto } from '../dto/room.dto';
import { comparePassword, hashPassword } from '../bcrypt/bcrypt';
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @UseGuards(JwtAuthGuard)
  @Get('f-rooms')
  findFriendRooms(@Req() request: RequestWithUser) {
    return this.chatService.findFriendRooms(request.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('all-rooms')
  findAllRooms(@Req() request: RequestWithUser) {
    return this.chatService.findAllRooms(request.user.id);
  }
  @UseGuards(JwtAuthGuard)
  @Get('find-new-members/:roomId')
  findNewMembers(@Param('roomId') roomId: string) {
    return this.chatService.findNewMembers(roomId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('PP-rooms')
  findPPRooms(@Req() request: RequestWithUser) {
    return this.chatService.findPPRooms(request.user.id);
  }
  @UseGuards(JwtAuthGuard)
  @Get('enabled-room')
  findAllEnabledRooms() {
    return this.chatService.findAllEnabledRooms();
  }
  @UseGuards(JwtAuthGuard)
  @Get('muted-users/:userId/:roomId')
  findisMuted(
    @Param('userId') userId: string,
    @Param('roomId') roomId: string,
  ) {
    return this.chatService.findisMuted(userId, roomId);
  }
  @UseGuards(JwtAuthGuard)
  @Get('room/msg/:roomId')
  findAllMsg(@Param('roomId') roomId: string) {
    return this.chatService.findAllMsg(roomId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('block/:userId')
  findBlockedUsers(@Req() request: RequestWithUser) {
    return this.chatService.findBlockedUsers(request.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('room/set-password/:roomId')
  setRoomPassword(
    @Body() data: { password: string; confirmPassword: string },
    @Param('roomId') roomId: string,
  ) {
    if (data.password === data.confirmPassword) {
      return this.chatService.setRoomPassword(
        roomId,
        hashPassword(data.password),
      );
    }
  }
  @UseGuards(JwtAuthGuard)
  @Patch('room/remove-password/:roomId')
  RemoveRoomPassword(@Param('roomId') roomId: string) {
    return this.chatService.removeRoomPassword(roomId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('room/change-password/:roomId')
  async changeRoomPassword(
    @Param('roomId') roomId: string,
    @Body()
    data: { oldPassword: string; newPassword: string; confirmPassword: string },
    @Res() response: Response,
  ) {
    console.log(data);
    const password = await this.chatService.getPassword(roomId);
    if (comparePassword(data.oldPassword, password.password)) {
      if (data.newPassword === data.confirmPassword) {
        await this.chatService.changeRoomPassword(
          roomId,
          hashPassword(data.newPassword),
        );
        return response.status(201).json({ message: 'Password changed' });
      }
    } else {
      return response.status(403).json({ message: 'Incorrect password' });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('room/:roomId')
  findUniqueRoom(@Param('roomId') roomId: string) {
    return this.chatService.findUniqueRoom(roomId);
  }
  @UseGuards(JwtAuthGuard)
  @Post('room/msg/:roomId')
  newMsg(@Body() data: MsgDto) {
    return this.chatService.newMsg(data);
  }
  @UseGuards(JwtAuthGuard)
  @Post('room/member')
  async addMember(
    @Body() data: { roomId: string; roomType: string; password: string },
    @Req() request: RequestWithUser,
    @Res() response: Response,
  ) {
    if (data.roomType === 'PROTECTED' && data.password !== '') {
      try {
        const password = await this.chatService.getPassword(data.roomId);
        if (comparePassword(data.password, password.password)) {
          await this.chatService.addMember(request.user.id, data.roomId);
          return response.status(201).json({ message: 'joinded room success' });
        } else {
          return response.status(403).json({ message: 'Incorrect password' });
        }
      } catch (e) {
        console.log(e);
      }
    } else if (data.roomType === 'PUBLIC') {
      await this.chatService.addMember(request.user.id, data.roomId);
      return response.status(201).json({ message: 'joinded room success' });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('create-room')
  createRoom(@Req() request: RequestWithUser, @Body() data: RoomDto) {
    if (data.type == '1' || data.type == '2' || data.type == '3') {
      let pictureUrl;
      data.password = hashPassword(data.password);
      if (data.type == '1') {
        pictureUrl =
          'https://res.cloudinary.com/dafjoc7f3/image/upload/v1709598795/OIG1.JFps3_7KZwYbAA_z90kms.jpg';
      } else if (data.type == '2') {
        pictureUrl =
          'https://res.cloudinary.com/dafjoc7f3/image/upload/v1709598787/OIG4.hVe7g_fmzj89.jpg';
      } else if (data.type == '3') {
        pictureUrl =
          'https://res.cloudinary.com/dafjoc7f3/image/upload/v1709598768/OIG1.x8.ZM_wjajbx.jpg';
      }
      return this.chatService.createRoom(request.user.id, data, pictureUrl);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('findall-users')
  findAllUsers() {
    return this.chatService.findAllUsers();
  }
}
