import { Injectable, HttpStatus } from '@nestjs/common';
import { authenticator } from 'otplib';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { HttpException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
@Injectable()
export class SettingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
  ) { }
  async disablePopUp(useremail: string) {
    await this.prisma.user.update({
      where: { email: useremail },
      data: { isfirsttime: false },
    });
  }
  async updateSettings(
    userId: number,
    newFirstName: string,
    newLastName: string,
    newUserName: string,
  ) {
    try {
      const user = await this.usersService.getById(userId.toString());
      if (!user) {
        throw new Error('User with this id does not exist');
      }

      const existingUser = await this.prisma.user.findUnique({
        where: { username: newUserName },
      });

      if (existingUser && existingUser.id !== user.id) {
        throw new Error('Username already exists');
      }

      await this.prisma.user.update({
        where: { id: userId.toString() },
        data: {
          username: newUserName,
          firstname: newFirstName,
          lastname: newLastName,
        },
      });
      this.disablePopUp(user.email)
      return { message: 'Settings updated successfully' };
    } catch (error) {
      let errorMessage: string;
      switch ((error as Error).message) {
        case 'User with this id does not exist':
          errorMessage = 'User with this id does not exist';
          throw new HttpException(errorMessage, HttpStatus.NOT_FOUND);
        case 'Username already exists':
          errorMessage = 'Username already exists';
          throw new HttpException(errorMessage, HttpStatus.CONFLICT);
        default:
          errorMessage = 'An error occurred while updating settings';
          throw new HttpException(
            errorMessage,
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
      }
    }
  }

  async updateImage(userId: number, ImageUrl: string) {
    try {
      await this.prisma.user.update({
        where: { id: userId.toString() },
        data: { pictureUrl: ImageUrl },
      });
      return { message: 'true' };
    } catch (error) {
      return { message: "An error occurred while updating image" }
    }
  }
}
