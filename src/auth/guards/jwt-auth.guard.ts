import { Injectable, ExecutionContext, Logger, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger('JwtAuthGuard');

  constructor() {
    super();
    this.logger.log('JwtAuthGuard initialized');
  }

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    
    this.logger.debug(`JWT Auth Check - Path: ${request.url}, Method: ${request.method}`);
    this.logger.debug(`Authorization header ${authHeader ? 'present' : 'missing'}`);
    
    if (authHeader) {
      const token = authHeader.split(' ')[1];
      this.logger.debug(`Token length: ${token?.length || 0}`);
    }
    
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    // Add better error handling
    if (err || !user) {
      const errorMessage = err?.message || info?.message || 'Unauthorized';
      this.logger.error(`Authentication failed: ${errorMessage}`);
      throw err || new UnauthorizedException(errorMessage);
    }
    
    this.logger.debug(`User authenticated: ${user.email}, Role: ${user.role}`);
    return user;
  }
} 