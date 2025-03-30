import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class BasicAuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException();
    }

    const [type, credentials] = authHeader.split(' ');
    
    if (type !== 'Basic') {
      throw new UnauthorizedException();
    }

    const [username, password] = Buffer.from(credentials, 'base64')
      .toString()
      .split(':');

    const isValid = await this.authService.validateUser(username, password);
    
    if (!isValid) {
      throw new UnauthorizedException();
    }

    return true;
  }
} 