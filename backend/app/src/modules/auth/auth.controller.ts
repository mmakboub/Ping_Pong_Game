import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import RegisterDto from './dto/register.dto';
import { FtAuthGuard } from './42-auth.guard';
import JwtAuthGuard from './jwt-auth.guard';
import RequestWithUser from './requestWithUser.interface';
import { Response } from 'express';
import { User } from '@prisma/client';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { prisma } from '../../prisma';
import { HttpException } from '@nestjs/common';
import { TfaService } from './tfa/tfa.service';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly tfaService: TfaService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private configService: ConfigService,
  ) { }

  @Get()
  @UseGuards(FtAuthGuard)
  async auth42(@Req() req) { }

  @Get('redirect')
  @UseGuards(FtAuthGuard)
  async auth42Redirect(@Req() req: any, @Res() response: Response) {
    const user = await this.authService.register(req.user);
    const request = req.user;
    if (request) {
      const id = request.userId;
      if (!id) {
        throw new HttpException(
          'User with this id does not exist',
          HttpStatus.NOT_FOUND,
        );
      }
      if (user && user.twoFactor === true) {
        response.cookie('userId', req.user.userId, { httpOnly: true });
        return response.redirect(this.configService.get<string>('CORS_URL', "http://localhost:3000") + '/2fa');
      }
    }
    const cookie = this.authService.getCookieWithJwtToken(req.user.userId);
    response.setHeader('Set-Cookie', cookie);
    return response.redirect(this.configService.get<string>('CORS_URL', "http://localhost:3000") + '/profile');
  }

  @Post('two-factor')
  async twoFactorAuth(@Body() data, @Req() req, @Res() resp: Response) {
    try {
      const res = await this.tfaService.getTwoFactorId(req.cookies.userId)
      if (res) {
        const isCodeValid = await this.tfaService.codeVerification(data.code, res.twoFactorId);
        if (!isCodeValid) {
          return resp.status(201).json({ message: false });
        }
        const cookie = this.authService.getCookieWithJwtToken(req.cookies.userId);
        resp.setHeader('Set-Cookie', cookie);
        return resp.status(201).json({ message: true });
      }
    }
    catch (error) {
      return { message: "Error in validation" }
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('log-out')
  async logOut(@Req() request: RequestWithUser, @Res() response: Response) {
    response.setHeader('Set-Cookie', this.authService.getCookieForLogOut());
    return response.sendStatus(200);
  }

  @UseGuards(JwtAuthGuard)
  @Get('user')
  authenticate(@Req() request: RequestWithUser) {
    const user = request.user;
    return user;
  }
}
