/**
 * DEBUG AUTHENTICATION
 * 
 * Ce fichier contient des utilitaires pour déboguer l'authentification.
 * Veuillez ajouter ce code dans votre application pour résoudre les problèmes d'authentification.
 */

import { Logger } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

const logger = new Logger('AuthDebug');

/**
 * Fonction à appeler avec le token JWT pour vérifier s'il est valide 
 * Cette fonction ne change pas votre code, elle aide juste à diagnostiquer le problème.
 */
export function debugJwtToken(token: string): void {
  logger.log('== JWT DEBUG ==');
  
  try {
    // Étape 1: Vérifier le format du token
    logger.log(`Token format check: ${token.startsWith('ey') ? 'PASS' : 'FAIL'}`);
    
    // Étape 2: Décoder le token sans vérifier la signature
    const decoded = jwt.decode(token, { complete: true });
    logger.log('Decoded token (header):', decoded?.header);
    logger.log('Decoded token (payload):', decoded?.payload);
    
    // Étape 3: Vérifier les valeurs importantes
    const payload = decoded?.payload as any;
    if (payload) {
      logger.log(`Subject (sub): ${payload.sub || 'MISSING'}`);
      logger.log(`Expiration (exp): ${payload.exp ? new Date(payload.exp * 1000).toISOString() : 'MISSING'}`);
      logger.log(`Issued At (iat): ${payload.iat ? new Date(payload.iat * 1000).toISOString() : 'MISSING'}`);
      
      // Vérifier si le token est expiré
      if (payload.exp) {
        const now = Math.floor(Date.now() / 1000);
        logger.log(`Token is ${payload.exp > now ? 'valid' : 'EXPIRED'}`);
      }
    }
    
    // Étape 4: Tenter de vérifier avec différents secrets
    const secrets = [
      process.env.JWT_SECRET || 'secretKey',
      'secretKey',
      'your-secret-key-for-development-environment'
    ];
    
    for (const secret of secrets) {
      try {
        const verified = jwt.verify(token, secret);
        logger.log(`Verification successful with secret: ${secret === process.env.JWT_SECRET ? 'From ENV' : secret}`);
        break;
      } catch (verifyError) {
        logger.log(`Verification failed with secret: ${secret === process.env.JWT_SECRET ? 'From ENV' : secret}`);
      }
    }
  } catch (error) {
    logger.error('Error analyzing token:', error.message);
  }
  
  logger.log('== END JWT DEBUG ==');
}

/**
 * Middleware de débogage - ajoutez cela à votre application pour voir tous les en-têtes et tokens
 */
export function authDebugMiddleware(req, res, next) {
  logger.log(`Request to ${req.method} ${req.url}`);
  
  try {
    // Log all headers for debugging
    logger.log('Headers:', JSON.stringify(req.headers));
    
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      logger.log(`Found token: ${token.substring(0, 10)}...`);
      debugJwtToken(token);
    } else {
      logger.log('No authorization token found');
    }
  } catch (err) {
    logger.error('Error in auth debug middleware:', err.message);
  }
  
  next();
} 