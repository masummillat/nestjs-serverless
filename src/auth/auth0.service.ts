import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class Auth0Service {
  constructor(private configService: ConfigService) {}
  private readonly auth0Domain = this.configService.get<string>('AUTH0_DOMAIN');
  private readonly managementClientId = this.configService.get<string>(
    'AUTH0_MTOM_CLIENT_ID',
  );
  private readonly managementClientSecret = this.configService.get<string>(
    'AUTH0_MTOM_CLIENT_SECRET',
  );
  private readonly managementAudience = `https://${this.auth0Domain}/api/v2/`;

  private async getManagementApiToken(): Promise<string> {
    try {
      const response = await axios.post(
        `https://${this.auth0Domain}/oauth/token`,
        {
          client_id: this.managementClientId,
          client_secret: this.managementClientSecret,
          audience: this.managementAudience,
          grant_type: 'client_credentials',
        },
      );

      return response.data.access_token;
    } catch (error: any) {
      console.log(error);
      throw new Error('Failed to obtain management API access token');
    }
  }

  // Fetch User Info by ID
  async getUserInfo(userId: string): Promise<any> {
    const token = await this.getManagementApiToken();
    try {
      const response = await axios.get(
        `https://${this.auth0Domain}/api/v2/users/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      return response.data;
    } catch (error) {
      throw new Error(
        `Failed to fetch user info: ${error.response.data.message}`,
      );
    }
  }

  // Update User Metadata
  async updateUserMetadata(
    userId: string,
    metadata: Record<string, any>,
  ): Promise<any> {
    const token = await this.getManagementApiToken();

    try {
      const response = await axios.patch(
        `https://${this.auth0Domain}/api/v2/users/${userId}`,
        {
          user_metadata: metadata,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      return response.data;
    } catch (error) {
      throw new Error(
        `Failed to update user metadata: ${error.response.data.message}`,
      );
    }
  }

  // Additional methods to interact with Auth0 Management API
  // For example: deleting users, assigning roles, etc.
}
