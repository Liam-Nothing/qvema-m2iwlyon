import { Controller, Post, Body, UseGuards, Request, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CreateUserDto } from '../modules/users/dto/create-user.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiProperty, ApiBearerAuth } from '@nestjs/swagger';
import { UserRole } from '../modules/users/entities/user.entity';

// DTO d'exemple pour la documentation Swagger
class RegisterUserDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Adresse email unique',
  })
  email: string;

  @ApiProperty({
    example: 'StrongPassword123!',
    description: 'Mot de passe sécurisé',
  })
  password: string;

  @ApiProperty({
    example: 'John',
    description: 'Prénom',
  })
  firstname: string;

  @ApiProperty({
    example: 'Doe',
    description: 'Nom de famille',
  })
  lastname: string;

  @ApiProperty({
    example: UserRole.ENTREPRENEUR,
    description: 'Rôle de l\'utilisateur',
    enum: UserRole,
    default: UserRole.ENTREPRENEUR,
  })
  role: UserRole;
}

class LoginDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Adresse email',
  })
  email: string;

  @ApiProperty({
    example: 'StrongPassword123!',
    description: 'Mot de passe',
  })
  password: string;
}

@ApiTags('Authentification')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Inscription d\'un nouvel utilisateur' })
  @ApiBody({ 
    type: RegisterUserDto,
    description: 'Données d\'inscription de l\'utilisateur',
    required: true 
  })
  @ApiResponse({
    status: 201,
    description: 'L\'utilisateur a été créé avec succès',
    schema: {
      example: {
        id: 'uuid',
        email: 'user@example.com',
        firstname: 'John',
        lastname: 'Doe',
        role: UserRole.ENTREPRENEUR,
        createdAt: '2024-03-29T12:00:00.000Z'
      }
    }
  })
  @ApiResponse({
    status: 400,
    description: 'Données invalides ou email déjà utilisé'
  })
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({ summary: 'Connexion d\'un utilisateur' })
  @ApiBody({
    type: LoginDto,
    description: 'Identifiants de connexion',
    required: true
  })
  @ApiResponse({
    status: 200,
    description: 'Connexion réussie',
    schema: {
      example: {
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        user: {
          id: 'uuid',
          email: 'user@example.com',
          firstname: 'John',
          lastname: 'Doe',
          role: UserRole.ENTREPRENEUR
        }
      }
    }
  })
  @ApiResponse({
    status: 401,
    description: 'Identifiants invalides'
  })
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Récupérer le profil de l\'utilisateur connecté' })
  @ApiResponse({
    status: 200,
    description: 'Profil récupéré avec succès',
    schema: {
      example: {
        id: 'uuid',
        email: 'user@example.com',
        role: UserRole.ENTREPRENEUR
      }
    }
  })
  @ApiResponse({
    status: 401,
    description: 'Non autorisé'
  })
  getProfile(@Request() req) {
    return req.user;
  }
} 