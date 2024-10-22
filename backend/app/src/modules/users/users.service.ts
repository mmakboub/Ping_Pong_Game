import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { prisma } from '../../prisma';

@Injectable()
export class UsersService {
  async getById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      include: { achievements: true },
    });
    if (user) {
      return user;
    }
    throw new HttpException(
      'User with this id does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  async getByEmail(email: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (user) {
      return user;
    }
    throw new HttpException(
      'User with this email does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  async create(userData: CreateUserDto) {
    const user = await prisma.user.findUnique({
      where: { email: userData.email },
    });
    if (user) return user;

    const newUser = await prisma.user.create({
      data: {
        id: userData.userId.toString(),
        username: userData.login,
        email: userData.email,
        pictureUrl: userData.picture,
        firstname: userData.firstName,
        lastname: userData.lastName,
        achievements: {
          create: [
            { type: 'LONGEVITY', done: false },
            { type: 'STRATEGIC', done: false },
            { type: 'PRODIGY', done: false },
            { type: 'GOLDEN', done: false },
            { type: 'COMEBACK', done: false },
            { type: 'RALLY', done: false },
            { type: 'MASTER', done: false },
            { type: 'CHALLENGER', done: false },
          ],
        },
      },
    });

    return newUser;
  }
}
