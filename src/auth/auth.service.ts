import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../modules/users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private readonly logger = new Logger('AuthService');

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {
    this.logger.log('AuthService initialized');
  }

  async validateUser(email: string, password: string): Promise<any> {
    this.logger.debug(`Validating user credentials for email: ${email}`);
    try {
      const user = await this.usersService.findByEmail(email);
      const isPasswordValid = await bcrypt.compare(password, user.password);
      
      if (isPasswordValid) {
        const { password, ...result } = user;
        this.logger.debug(`User ${email} authenticated successfully`);
        return result;
      }
      this.logger.debug(`Invalid password for user ${email}`);
      return null;
    } catch (error) {
      this.logger.error(`Authentication failed for ${email}: ${error.message}`);
      return null;
    }
  }

  async login(user: any) {
    this.logger.debug(`Generating JWT token for user ${user.email}`);
    const payload = { email: user.email, sub: user.id, role: user.role };
    
    this.logger.debug(`JWT payload: ${JSON.stringify(payload)}`);
    this.logger.debug(`JWT secret: ${process.env.JWT_SECRET ? '[SET]' : 'default'}`);
    
    const token = this.jwtService.sign(payload);
    this.logger.debug(`JWT token generated successfully (length: ${token.length})`);
    
    return {
      access_token: token,
      user: {
        id: user.id,
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
        role: user.role,
      },
    };
  }

  async register(createUserDto: any) {
    this.logger.debug(`Registering new user with email: ${createUserDto.email}`);
    try {
      const user = await this.usersService.create(createUserDto);
      
      // Enlever le mot de passe de la réponse
      const { password, ...result } = user;
      this.logger.debug(`User ${createUserDto.email} registered successfully with ID: ${user.id}`);
      return result;
    } catch (error) {
      this.logger.error(`Registration failed for ${createUserDto.email}: ${error.message}`);
      throw error;
    }
  }
} 