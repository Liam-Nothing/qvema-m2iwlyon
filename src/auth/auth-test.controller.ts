import { Controller, Get, Post, Request, UseGuards, Logger, Headers, Body } from '@nestjs/common';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Tests d\'authentification')
@Controller('auth-test')
export class AuthTestController {
  private readonly logger = new Logger('AuthTestController');

  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @Get('public')
  @ApiOperation({ summary: 'Endpoint public pour tester que le serveur fonctionne' })
  public() {
    return { message: 'Cet endpoint est public et accessible sans authentification' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('private')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Endpoint privé pour tester l\'authentification' })
  @ApiResponse({ status: 200, description: 'Authentification réussie' })
  @ApiResponse({ status: 401, description: 'Non autorisé' })
  private(@Request() req) {
    this.logger.debug(`Requête authentifiée reçue pour /auth-test/private`);
    this.logger.debug(`Utilisateur authentifié: ${JSON.stringify(req.user)}`);
    
    return {
      message: 'Authentification réussie!',
      user: req.user,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('headers')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Affiche les en-têtes de la requête' })
  headers(@Headers() headers) {
    this.logger.debug('Headers reçus:', headers);
    return { headers };
  }

  @Post('verify-token')
  @ApiOperation({ summary: 'Vérifie un token JWT soumis manuellement' })
  verifyToken(@Body() body: { token: string }) {
    try {
      const decoded = this.jwtService.verify(body.token);
      this.logger.debug(`Token vérifié avec succès: ${JSON.stringify(decoded)}`);
      return {
        valid: true,
        decoded,
      };
    } catch (error) {
      this.logger.error(`Erreur de vérification du token: ${error.message}`);
      return {
        valid: false,
        error: error.message,
      };
    }
  }
} 