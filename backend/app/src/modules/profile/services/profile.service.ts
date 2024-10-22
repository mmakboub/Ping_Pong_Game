import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class ProfileService {
  prisma = new PrismaClient();

  async findUser(username: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { username: username },
        include: {
          achievements: true,
        },
      });
      return user;
    } catch (e) {
      console.log(e);
    }
  }
  async findFriend(username: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { username: username },
        select: {
          friends: {
            select: {
              id: true,
              username: true,
              level: true,
              pictureUrl: true,
              rank: true,
              isOnline: true,
              xp: true,
            },
          },
        },
      });
      return user;
    } catch (e) {
      console.log(e);
    }
  }
  async findHistorique(username: string) {
    try {
      const user = await this.prisma.history.findMany({
        where: { OR: [{ usernameLose: username }, { usernameWin: username }] },
        orderBy: {
          date: 'desc',
        },
        include: {
          playerLose: {
            select: {
              username: true,
              pictureUrl: true,
              level: true,
              xp: true,
            },
          },
          playerWin: {
            select: {
              username: true,
              pictureUrl: true,
              level: true,
              xp: true,
            },
          },
        },
      });
      return user;
    } catch (e) {
      console.log(e);
    }
  }
  async searchFriends(username: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { username },
        include: {
          friends: {
            select: {
              username: true,
              pictureUrl: true,
            },
          },
        },
      });
      return user.friends;
    } catch (error) {
      throw new Error('Error searching friends');
    }
  }
  async findAllUsers() {
    try {
      const users = await this.prisma.user.findMany({
        orderBy: {
          xp: 'desc',
        },
        select: {
          username: true,
          pictureUrl: true,
          firstname: true,
          lastname: true,
          matchPlayed: true,
          matchLost: true,
          matchWon: true,
          xp: true,
          achievements: true,
          level: true,
        },
      });
      return users;
    } catch (e) {
      console.log(e);
    }
  }
}
