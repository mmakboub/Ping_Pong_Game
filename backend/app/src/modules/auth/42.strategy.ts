import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import Strategy from 'passport-42';
import { AuthService } from './auth.service';
import { config } from 'process';
import { ConfigService } from '@nestjs/config';
import { Profile } from 'passport';
import { VerifyCallback } from 'passport-oauth2';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class FtStrategy extends PassportStrategy(Strategy, '42') {
  constructor(private configService: ConfigService) {
    super({
      clientID: configService.get('UID'),
      clientSecret: configService.get('SECRET'),
      callbackURL: configService.get('CALLBACK_URL'),
    });
  }

  async validate(
    accessToken: string,
    refreshTocken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const user = {
      userId: profile.id,
      login: profile.username,
      email: profile.emails[0].value,
      picture: profile._json.image.link,
      firstName: profile.name.givenName,
      lastName: profile.name.familyName
    };
    done(null, user);
  }
}
