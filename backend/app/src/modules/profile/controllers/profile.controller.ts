import { Controller, Get, Param, Query, Req, UseGuards } from '@nestjs/common';
import { ProfileService } from '../services/profile.service';
import { Request } from 'express';
import JwtAuthGuard from 'src/modules/auth/jwt-auth.guard';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  // @Post()
  // create(@Body() createProfileDto: CreateProfileDto) {
  //   return this.profileService.create(createProfileDto);
  // }
  @Get('user/friends/:username')
  findAllFriend(@Req() req: Request, @Param('username') username: string) {
    return this.profileService.findFriend(username);
  }
  @UseGuards(JwtAuthGuard)
  @Get('user/historique/:username')
  findAllHistorique(@Req() req: Request, @Param('username') username: string) {
    return this.profileService.findHistorique(username);
  }

  @UseGuards(JwtAuthGuard)
  @Get('user/:username')
  findAll(@Req() req: Request, @Param('username') username: string) {
    return this.profileService.findUser(username);
  }

  @UseGuards(JwtAuthGuard)
  @Get('searchFriends/:username')
  async searchFriends(
    @Req() req: Request,
    @Param('username') username: string,
  ) {
    return this.profileService.searchFriends(username);
  }
  @UseGuards(JwtAuthGuard)
  @Get('findall-users')
  findAllUsers() {
    return this.profileService.findAllUsers();
  }
}
