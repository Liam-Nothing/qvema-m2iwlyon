import { Injectable, ExecutionContext, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  private readonly logger = new Logger('LocalAuthGuard');

  constructor() {
    super();
    this.logger.log('LocalAuthGuard initialized');
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    
    this.logger.debug(`Login attempt for ${request.body.email || 'unknown user'}`);
    
    // Le reste est géré par la stratégie Passport
    return super.canActivate(context) as Promise<boolean>;
  }

  handleRequest(err, user, info) {
    if (err || !user) {
      this.logger.error(`Login failed: ${err?.message || info?.message || 'Unknown error'}`);
      throw err || new Error('Login failed');
    }
    
    this.logger.debug(`Login successful for user: ${user.email}`);
    return user;
  }
} 