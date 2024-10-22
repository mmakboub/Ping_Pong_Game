import { Injectable } from '@nestjs/common';
import { Msg, PrismaClient } from '@prisma/client';
import { MsgDto } from '../dto/msg.dto';
import { RoomDto } from '../dto/room.dto';

@Injectable()
export class ChatService {
  prisma = new PrismaClient();
  async findUser(id: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: id },
        include: {
          friends: true,
        },
      });
      return user;
    } catch (e) {
      console.log(e);
    }
  }
  async findAllUsers() {
    try {
      const users = await this.prisma.user.findMany({
        select: {
          username: true,
          pictureUrl: true,
        },
      });
      return users;
    } catch (e) {
      console.log(e);
    }
  }
  async findAllMsg(roomId: string) {
    try {
      const msgs = await this.prisma.msg.findMany({
        where: { roomId: roomId },
      });
      return msgs;
    } catch (e) {
      console.log(e);
    }
  }
  async findFriendRooms(userId: string) {
    try {
      const rooms = await this.prisma.room.findMany({
        where: { member: { some: { id: userId } }, type: 'INDIVIDUAL' },
        include: {
          member: true,
          msgs: true,
        },
      });
      return rooms;
    } catch (e) {
      console.log(e);
    }
  }
  async findAllEnabledRooms() {
    try {
      const rooms = await this.prisma.room.findMany({
        where: { OR: [{ type: 'PUBLIC' }, { type: 'PROTECTED' }] },
        select: {
          id: true,
          name: true,
          pictureUrl: true,
        },
      });
      return rooms;
    } catch (e) {
      console.log(e);
    }
  }
  async findAllRooms(userId: string) {
    try {
      const rooms = await this.prisma.room.findMany({
        where: {
          member: { some: { id: userId } },
          NOT: { type: 'INDIVIDUAL' },
        },
        include: {
          member: true,
          admin: true,
          msgs: true,
        },
      });
      return rooms;
    } catch (e) {
      console.log(e);
    }
  }
  async findPPRooms(userId: string) {
    try {
      const rooms = await this.prisma.room.findMany({
        where: {
          type: { in: ['PUBLIC', 'PROTECTED'] },
        },
        include: {
          owner: {
            select: {
              username: true,
            },
          },
        },
      });
      return rooms;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
  async findAllRoomsId(userId: string) {
    try {
      const rooms = await this.prisma.room.findMany({
        where: { member: { some: { id: userId } } },
        select: {
          id: true,
        },
      });
      return rooms;
    } catch (e) {
      console.log(e);
    }
  }
  async findUniqueRoom(roomId: string) {
    try {
      const rooms = await this.prisma.room.findUnique({
        where: {
          id: roomId,
        },
        include: {
          member: true,
          admin: true,
          owner: true,
          baned: true,
        },
      });
      return rooms;
    } catch (e) {
      console.log(e);
    }
  }
  async newMsg(data: MsgDto) {
    try {
      if (data.type != 'INVITE_GAME') {
        const msg = await this.prisma.msg.create({
          data: {
            content: data.content,
            time: data.time,
            senderId: data.senderId,
            timeOnMilisecond: data.timeOnMilisecond,
            roomId: data.roomId,
            type: data.type,
            senderPicture: data.senderPicture,
          },
        });
        return msg;
      }
    } catch (e) {
      console.log(e);
    }
  }
  async createRoom(userId: string, data: RoomDto, pictureUrl: string) {
    let roomType;
    if (data.type === '1') {
      roomType = 'PUBLIC';
    } else if (data.type === '2') {
      roomType = 'PROTECTED';
    } else if (data.type === '3') {
      roomType = 'PRIVATE';
    }
    try {
      const room = await this.prisma.room.create({
        data: {
          name: data.name,
          type: roomType,
          pictureUrl: pictureUrl,
          password: data.password,
          member: {
            connect: { id: userId },
          },
          admin: {
            connect: { id: userId },
          },
          ownerId: userId,
        },
      });
      return room;
    } catch (e) {
      console.log(e);
    }
  }
  async addMember(userId: string, roomId: string) {
    try {
      const room = await this.prisma.room.update({
        where: { id: roomId },
        data: {
          member: {
            connect: { id: userId },
          },
        },
      });
      return room;
    } catch (e) {
      console.log(e);
    }
  }
  async getPassword(roomId: string) {
    try {
      const room = await this.prisma.room.findUnique({
        where: { id: roomId },
        select: {
          password: true,
        },
      });
      return room;
    } catch (e) {
      console.log(e);
    }
  }
  async setRoomPassword(roomId: string, password: string) {
    try {
      const room = await this.prisma.room.update({
        where: { id: roomId },
        data: {
          password: password,
          type: 'PROTECTED',
          pictureUrl:
            'https://res.cloudinary.com/dafjoc7f3/image/upload/v1709598787/OIG4.hVe7g_fmzj89.jpg',
        },
      });
      return room;
    } catch (e) {
      console.log(e);
    }
  }
  async changeRoomPassword(roomId: string, password: string) {
    try {
      const room = await this.prisma.room.update({
        where: { id: roomId },
        data: {
          password: password,
        },
      });
      return room;
    } catch (e) {
      console.log(e);
    }
  }
  removeRoomPassword(roomId: string) {
    try {
      const room = this.prisma.room.update({
        where: { id: roomId },
        data: {
          password: null,
          type: 'PUBLIC',
          pictureUrl:
            'https://res.cloudinary.com/dafjoc7f3/image/upload/v1709598795/OIG1.JFps3_7KZwYbAA_z90kms.jpg',
        },
      });
      return room;
    } catch (e) {
      console.log(e);
    }
  }
  async makeAdmin(roomId: string, userId: string) {
    try {
      const room = await this.prisma.room.update({
        where: { id: roomId },
        data: {
          admin: {
            connect: { id: userId },
          },
        },
      });
      return room;
    } catch (e) {
      console.log(e);
    }
  }
  async removeAdmin(roomId: string, userId: string) {
    try {
      const room = await this.prisma.room.update({
        where: { id: roomId },
        data: {
          admin: {
            disconnect: { id: userId },
          },
        },
      });
      return room;
    } catch (e) {
      console.log(e);
    }
  }
  async kickMember(roomId: string, userId: string) {
    try {
      const room = await this.prisma.room.update({
        where: { id: roomId },
        data: {
          member: {
            disconnect: { id: userId },
          },
          admin: {
            disconnect: { id: userId },
          },
        },
      });
      return room;
    } catch (e) {
      console.log(e);
    }
  }
  async banMember(roomId: string, userId: string) {
    try {
      const room = await this.prisma.room.update({
        where: { id: roomId },
        data: {
          baned: {
            connect: { id: userId },
          },
          member: {
            disconnect: { id: userId },
          },
          admin: {
            disconnect: { id: userId },
          },
        },
      });
      return room;
    } catch (e) {
      console.log(e);
    }
  }
  async blockFriend(userId: string, friendId: string) {
    try {
      const user = await this.prisma.user.update({
        where: { id: userId },
        data: {
          block: {
            connect: { id: friendId },
          },
        },
      });
      return user;
    } catch (e) {
      console.log(e);
    }
  }
  async muteMember(
    roomId: string,
    friendId: string,
    createat: string,
    period: string,
  ) {
    try {
      const muteUser = await this.prisma.mutedUsers.create({
        data: {
          userId: friendId,
          period: period,
          createat: createat,
          roomId: roomId,
        },
      });
      return muteUser;
    } catch (e) {}
  }
  async deblockFriend(userId: string, friendId: string) {
    try {
      const user = await this.prisma.user.update({
        where: { id: userId },
        data: {
          block: {
            disconnect: { id: friendId },
          },
        },
      });
      return user;
    } catch (e) {
      console.log(e);
    }
  }
  async deleteAll() {
    const deleteAll = await this.prisma.msg.deleteMany();
    return deleteAll;
  }
  async findBlockedUsers(userId: string) {
    try {
      const users = await this.prisma.user.findUnique({
        where: { id: userId },
        select: {
          block: true,
          blockBy: true,
        },
      });
      return users;
    } catch (e) {
      console.log(e);
    }
  }
  async findNewMembers(roomId: string) {
    try {
      const usersNotInRoom = await this.prisma.user.findMany({
        where: {
          NOT: {
            rooms: {
              some: {
                id: roomId,
              },
            },
          },
        },
      });
      return usersNotInRoom;
    } catch (e) {
      console.log(e);
    }
  }
  async addMembers(
    roomId: string,
    members: { id: string; username: string }[],
  ) {
    try {
      const room = await this.prisma.room.update({
        where: { id: roomId },
        data: {
          member: {
            connect: members.map((member) => ({ id: member.id })),
          },
          baned: {
            disconnect: members.map((member) => ({ id: member.id })),
          },
        },
      });
      return room;
    } catch (e) {
      console.log(e);
    }
  }
  async findisMuted(userId: string, roomId: string) {
    try {
      const user = await this.prisma.mutedUsers.findUnique({
        where: {
          userId_roomId: {
            userId: userId,
            roomId: roomId,
          },
        },
      });
      return user;
    } catch (e) {
      console.log(e);
    }
  }

  async unmuteMember(userId: string, roomId: string) {
    try {
      const user = await this.prisma.mutedUsers.delete({
        where: {
          userId_roomId: {
            userId: userId,
            roomId: roomId,
          },
        },
      });
      return user;
    } catch (e) {
      console.log(e);
    }
  }
}
