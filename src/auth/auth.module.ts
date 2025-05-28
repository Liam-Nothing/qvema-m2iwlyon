import { Module, Logger } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthTestController } from './auth-test.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { UsersModule } from '../modules/users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    UsersModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const secret = configService.get('JWT_SECRET') || 'secretKey';
        const expiration = configService.get('JWT_EXPIRATION') || '1h';
        const logger = new Logger('JwtModule');
        
        logger.log(`JWT configured with expiration: ${expiration}`);
        logger.log(`JWT secret is ${secret === 'secretKey' ? 'default' : 'custom'}`);
        
        return {
          secret,
          signOptions: { expiresIn: expiration },
        };
      },
    }),
  ],
  controllers: [AuthController, AuthTestController],
  providers: [
    AuthService, 
    JwtStrategy, 
    LocalStrategy,
    {
      provide: 'APP_LOGGER',
      useFactory: () => {
        return new Logger('Auth');
      },
    },
  ],
  exports: [AuthService, JwtModule],
})
export class AuthModule {} 