import { Logger } from '@nestjs/common';

export class ErrorLogger extends Logger {
  error(message: string, trace: string, context?: string) {
    const timestamp = new Date().toISOString();
    const errorDetails = {
      timestamp,
      message,
      trace,
      context,
    };

    // Log dans la console avec plus de détails
    super.error(
      `[${timestamp}] ${message}`,
      trace,
      context,
    );

    // Log dans un fichier (optionnel)
    console.error(JSON.stringify(errorDetails, null, 2));
  }
} 