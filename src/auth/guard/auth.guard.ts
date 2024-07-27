import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { JwtConfigService } from '../constants/jwt-config.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly jwtConfigService: JwtConfigService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request:Request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException("The token is non-existent");
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.jwtConfigService.secret,
      });
      request.body = payload;
    } catch {
      throw new UnauthorizedException("Unknown token error");
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
