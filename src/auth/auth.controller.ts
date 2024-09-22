import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Auth0Service } from './auth0.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly auth0Service: Auth0Service,
  ) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getProfile(@Request() req) {
    return this.auth0Service.getUserInfo(req.user.sub);
  }
  // Fetch user info from Auth0 by user ID
  @Get('users/:id')
  @UseGuards(JwtAuthGuard)
  async getUserInfo(@Param('id') userId: string): Promise<any> {
    return this.auth0Service.getUserInfo(userId);
  }

  // Update user metadata in Auth0
  @Patch('users/:id')
  @UseGuards(JwtAuthGuard)
  async updateUserMetadata(
    @Param('id') userId: string,
    @Body() metadata: Record<string, any>,
  ): Promise<any> {
    return this.auth0Service.updateUserMetadata(userId, metadata);
  }
}
