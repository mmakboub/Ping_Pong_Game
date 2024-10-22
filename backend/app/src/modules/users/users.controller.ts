import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import JwtAuthGuard from '../auth/jwt-auth.guard';
import RequestWithUser from '../auth/requestWithUser.interface';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Req() request: RequestWithUser): any {
    return this.usersService.getById(request.user.id);
  }
}
