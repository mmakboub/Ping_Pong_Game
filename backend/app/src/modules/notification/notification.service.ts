import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class NotificationService {
  prisma = new PrismaClient();

  async addFriendRequest(senderId: string, receiverId: string) {
    const exits = await this.checkFriendRequest(receiverId, senderId);
    try {
      if (exits) throw new Error('friend 1 request allready sent');
      const friendRequest = await this.prisma.friendshipRequest.create({
        data: {
          senderId: senderId,
          receiverId: receiverId,
        },
      });
      return friendRequest;
    } catch (e) {
      console.log('friend request allready sent');
    }
  }
  async removeFriendRequest(senderId: string, receiverId: string) {
    const exits = await this.checkFriendRequest(receiverId, senderId);
    try {
      if (exits) {
        const friendRequest = await this.prisma.friendshipRequest.delete({
          where: {
            senderId_receiverId: {
              senderId: senderId,
              receiverId: receiverId,
            },
          },
        });
        return friendRequest;
      }
      return exits;
    } catch (e) {
      console.log('friend request allready sent');
    }
  }

  async checkFriendRequest(senderId: string, receiverId: string) {
    try {
      const friendRequest = await this.prisma.friendshipRequest.findFirst({
        where: {
          OR: [
            { senderId: senderId, receiverId: receiverId },
            { senderId: receiverId, receiverId: senderId },
          ],
        },
        select: {
          status: true,
          senderId: true,
        },
      });
      return friendRequest;
    } catch (e) {
      console.log();
    }
  }

  async DeleteFriendRequest(senderId: string, receiverId: string) {
    try {
      const friendRequest = await this.prisma.friendshipRequest.deleteMany({
        where: {
          OR: [
            { senderId: senderId, receiverId: receiverId },
            { senderId: receiverId, receiverId: senderId },
          ],
        },
      });
      return friendRequest;
    } catch (e) {
      console.log(e);
    }
  }
  async findFriendRequest(receiverId: string) {
    try {
      const friendRequest = await this.prisma.friendshipRequest.findMany({
        where: {
          receiverId: receiverId,
          status: 'PENDING',
        },
        select: {
          status: true,
          sender: {
            select: {
              username: true,
              pictureUrl: true,
            },
          },
        },
      });
      return friendRequest;
    } catch (e) {
      console.log(e);
    }
  }
  async makeFriendship(senderId: string, receiverId: string) {
    try {
      await this.checkFriendRequest(senderId, receiverId).then((res) => {
        if (res.status !== 'PENDING') throw new Error('no pending request');
      });
      await this.prisma.user.update({
        where: { username: senderId },
        data: {
          friends: {
            connect: { username: receiverId },
          },
        },
      });
      await this.prisma.user.update({
        where: { username: receiverId },
        data: {
          friends: {
            connect: { username: senderId },
          },
        },
      });
      await this.prisma.friendshipRequest.updateMany({
        where: {
          OR: [
            { senderId: senderId, receiverId: receiverId },
            { senderId: receiverId, receiverId: senderId },
          ],
        },
        data: {
          status: 'ACCEPTED',
        },
      });
      const newroom = await this.prisma.room.create({
        data: {
          name: `${senderId}-room-${receiverId}`,
          member: {
            connect: [{ username: senderId }, { username: receiverId }],
          },
        },
      });
      return newroom;
    } catch (e) {
      console.log('friend request allready accepted');
    }
  }
  async getUserByUserName(username: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          username: username,
        },
        select: {
          id: true,
        },
      });
      return user;
    } catch (e) {
      console.log(e);
    }
  }
  async getUserById(id: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id: id,
        },
        select: {
          username: true,
        },
      });
      return user;
    } catch (e) {
      console.log(e);
    }
  }
}
