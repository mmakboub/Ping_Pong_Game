import { Controller, Get, Req, Body, UseGuards, Post } from '@nestjs/common';
import { SettingService } from './setting.service';
import { AuthGuard } from '@nestjs/passport';
import { UpdateInfoDto } from './update-info.dto';
@Controller('Setting')
export class SettingController {
  constructor(private readonly settingService: SettingService) { }
  @Post('update')
  @UseGuards(AuthGuard('jwt'))
  async updateInfo(@Body() updateInfoDto: UpdateInfoDto, @Req() req) {
    try {
      const userId = req.user.id;
      const updatedversion = await this.settingService.updateSettings(
        userId,
        updateInfoDto.firstName,
        updateInfoDto.lastName,
        updateInfoDto.userName,
      );
      if (updatedversion.message == 'Settings updated successfully') {
        return { message: true };
      }
      return { message: false };
    } catch (error) {
      return { message: "Error on updating data" }
    }
  }

  @Post('upload')
  @UseGuards(AuthGuard('jwt'))
  async uploadImage(@Body() ImageUrl: any, @Req() req) {
    try {
      const userId = req.user.id;
      const updatedImg = await this.settingService.updateImage(
        userId,
        ImageUrl.imageUrl,
      );
    } catch (error) {
      return { message: "Error uploading image" }
    }
  }
}
