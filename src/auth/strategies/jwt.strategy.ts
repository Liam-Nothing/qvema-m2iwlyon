import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

// Fonction personnalisée pour extraire le token qui essaie plusieurs méthodes
const customExtractor = (req: Request) => {
  const logger = new Logger('JWTExtractor');
  
  // Méthode 1: Bearer token standard dans l'en-tête Authorization
  let token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
  if (token) {
    logger.debug('Token extrait de l\'en-tête Authorization Bearer');
    return token;
  }
  
  // Méthode 2: Token brut dans l'en-tête Authorization (sans préfixe Bearer)
  const authHeader = req.headers.authorization;
  if (authHeader && !authHeader.startsWith('Bearer ')) {
    logger.debug('Token brut trouvé dans l\'en-tête Authorization');
    return authHeader;
  }
  
  // Méthode 3: Token dans un cookie
  if (req.cookies && req.cookies.token) {
    logger.debug('Token extrait du cookie');
    return req.cookies.token;
  }
  
  // Méthode 4: Token dans les paramètres de requête
  if (req.query && req.query.token) {
    logger.debug('Token extrait des paramètres de requête');
    return req.query.token as string;
  }
  
  logger.debug('Aucun token trouvé');
  return null;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger('JwtStrategy');

  constructor() {
    super({
      jwtFromRequest: customExtractor,
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'secretKey',
      passReqToCallback: true, // Important pour avoir accès à la requête
    });
    this.logger.log('JwtStrategy initialized with secret: ' + (process.env.JWT_SECRET ? '[SECRET]' : 'default'));
  }

  async validate(request: Request, payload: any) {
    this.logger.debug(`JWT payload validation: ${JSON.stringify({
      sub: payload.sub,
      email: payload.email,
      role: payload.role
    })}`);
    
    // Log de la requête pour débogage
    this.logger.debug(`Request path: ${request.url}`);
    
    return { 
      id: payload.sub, 
      sub: payload.sub, // Garder les deux pour compatibilité
      email: payload.email, 
      role: payload.role 
    };
  }
} 