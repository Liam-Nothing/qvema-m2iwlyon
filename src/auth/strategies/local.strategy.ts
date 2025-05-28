import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger('LocalStrategy');

  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
    });
    this.logger.log('LocalStrategy initialized');
  }

  async validate(email: string, password: string): Promise<any> {
    this.logger.debug(`Attempting to validate user: ${email}`);
    const user = await this.authService.validateUser(email, password);
    
    if (!user) {
      this.logger.warn(`Authentication failed for user: ${email}`);
      throw new UnauthorizedException('Invalid credentials');
    }
    
    this.logger.debug(`User authenticated: ${email}`);
    return user;
  }
} 