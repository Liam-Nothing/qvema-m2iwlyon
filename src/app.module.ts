import { Module, Logger, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './auth/auth.module';
import { ProjectsModule } from './projects/projects.module';
import { InvestmentsModule } from './investments/investments.module';
import { DataSource } from 'typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const logger = new Logger('Database');
        const dbUrl = configService.get('DATABASE_URL');
        
        // Masquer les credentials dans les logs
        let sanitizedUrl = 'Not configured';
        if (dbUrl) {
          const urlParts = dbUrl.split('@');
          if (urlParts.length > 1) {
            const credentialsPart = urlParts[0].split('://')[1].split(':')[0];
            sanitizedUrl = dbUrl.replace(`${credentialsPart}:***********`, '****:****');
          } else {
            sanitizedUrl = dbUrl;
          }
        }
        
        logger.log(`Configuring Neon PostgreSQL connection: ${sanitizedUrl}`);
        
        return {
          type: 'postgres',
          url: dbUrl,
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: process.env.NODE_ENV !== 'production',
          ssl: true, // Forcer SSL pour Neon
          logging: true,
          logger: 'advanced-console',
          // Paramètres spécifiques pour Neon
          extra: {
            max: 20, // Nombre max de connexions
            connectionTimeoutMillis: 30000, // Timeout de connexion
          }
        };
      },
    }),
    UsersModule,
    AuthModule,
    ProjectsModule,
    InvestmentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnModuleInit {
  private readonly logger = new Logger('AppModule');

  constructor(private dataSource: DataSource) {}

  async onModuleInit() {
    try {
      // Vérifier la connexion à la base de données
      if (this.dataSource.isInitialized) {
        // Exécuter une requête de test
        const result = await this.dataSource.query('SELECT now()');
        this.logger.log(`✅ Neon PostgreSQL connection is working! Database time: ${result[0].now}`);
        
        // Afficher les informations de la base de données
        const dbInfo = await this.dataSource.query(`
          SELECT current_database() as db_name, 
                 current_user as user_name,
                 version() as pg_version
        `);
        
        if (dbInfo && dbInfo.length > 0) {
          this.logger.log(`🔍 Connected to database: ${dbInfo[0].db_name}`);
          this.logger.log(`👤 Connected as user: ${dbInfo[0].user_name}`);
          this.logger.log(`🛢️ PostgreSQL version: ${dbInfo[0].pg_version.split(',')[0]}`);
        }
      } else {
        this.logger.error('❌ Database connection is not initialized!');
      }
    } catch (error) {
      this.logger.error(`❌ Failed to verify database connection: ${error.message}`);
    }
  }
}
