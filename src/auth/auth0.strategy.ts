import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-auth0';

@Injectable()
export class Auth0Strategy extends PassportStrategy(Strategy, 'auth0') {
  constructor(private configService: ConfigService) {
    super({
      domain: configService.get<string>('AUTH0_DOMAIN'),
      clientID: configService.get<string>('AUTH0_CLIENT_ID'),
      clientSecret: configService.get<string>('AUTH0_CLIENT_SECRET'),
      callbackURL: configService.get<string>('AUTH0_CALLBACK_URL'),
      scope: 'openid profile email',
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    extraParams: any,
    profile: any,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    done: Function,
  ) {
    return done(null, profile);
  }
}
