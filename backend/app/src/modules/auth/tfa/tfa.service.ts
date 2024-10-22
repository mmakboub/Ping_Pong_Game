import { Injectable } from '@nestjs/common';
import { authenticator } from 'otplib';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { toDataURL } from 'qrcode';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TfaService {
  constructor(private readonly prisma: PrismaService, private readonly configService: ConfigService,) { }

  public async generateTfa(useremail: string) {
    const user = await this.prisma.user.findUnique({
      where: { email: useremail }
    });

    let secret = user?.twoFactorId;
    if (!secret) {
      secret = authenticator.generateSecret();
      await this.prisma.user.update({
        where: { email: useremail },
        data: { twoFactorId: secret }
      });
    }

    const otpauthUrl = authenticator.keyuri(useremail, this.configService.get('TFA_APP_NAME'), secret);

    return {
      secret,
      otpauthUrl,
    };
  }


  async enableTfaForUser(useremail: string, secret: string) {
    await this.prisma.user.update({
      where: { email: useremail },
      data: { twoFactorId: secret, twoFactor: true },
    });
  }

  async disableTfaForUser(useremail: string, secret: string) {
    await this.prisma.user.update({
      where: { email: useremail },
      data: { twoFactorId: "", twoFactor: false },
    });
  }

  codeVerification(_token: string, secret: string) {
    return authenticator.verify({ token: _token, secret });
  }

  async generateQrCodeDataURL(otpAuthUrl: string) {
    return toDataURL(otpAuthUrl);
  }

  async getTwoFactorId(userId: string) {
    try {
      const id = await this.prisma.user.findUnique({
        where: {
          id: userId
        },
        select: {
          twoFactorId: true
        }
      })
      return id;
    } catch (e) {
      console.log("user not authorized");
    }
  }
}
