import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { TfaService } from './tfa.service';
import { AuthGuard } from '@nestjs/passport';
import RequestWithUser from '../requestWithUser.interface';

@Controller('tfa')
export class TfaController {

  constructor(
    private readonly tfaService: TfaService,
  ) { }

  @Get('generate-2fa')
  @UseGuards(AuthGuard('jwt'))
  async generateQrCode(@Req() req: RequestWithUser) {
    const { otpauthUrl } = await this.tfaService.generateTfa(req.user.email);
    try {
      const qrcodeUrl = await this.tfaService.generateQrCodeDataURL(otpauthUrl);
      return { qrcode: qrcodeUrl };
    } catch (error) {
      console.error('Error on generating QR code:', error);

    }
  }
  @Post('enable-2fa')
  @UseGuards(AuthGuard('jwt'))
  async enableTfa(@Body() data, @Req() req) {

    try {
      const isCodeValid = this.tfaService.codeVerification(
        data.code,
        req.user.twoFactorId,
      );

      if (isCodeValid) {
        this.tfaService.enableTfaForUser(req.user.email, req.user.twoFactorId)
        return {
          message: 'true',
        };
      }
      return ({
        message: 'false',
      })
    }
    catch (error) {
      return { message: "Error on enabling" }
    }

  }


  @Post('disable-2fa')
  @UseGuards(AuthGuard('jwt'))
  async disable2Fa(@Body() data, @Req() req) {
    try {
      await this.tfaService.disableTfaForUser(req.user.email, req.user.twoFactorId);
      return {
        message: "disabled"
      };

    }
    catch {
      return { message: "Error on disabling" }
    }
  }
}