import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { InvestmentsService } from './investments.service';
import { CreateInvestmentDto } from './dto/investment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../modules/users/entities/user.entity';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiBody } from '@nestjs/swagger';

@ApiTags('Investissements')
@ApiBearerAuth('access-token')
@Controller('investments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class InvestmentsController {
  constructor(private readonly investmentsService: InvestmentsService) {}

  @Post()
  @Roles(UserRole.INVESTOR)
  @ApiOperation({ summary: 'Créer un nouvel investissement' })
  @ApiBody({ type: CreateInvestmentDto })
  @ApiResponse({
    status: 201,
    description: 'Investissement créé avec succès',
    schema: {
      example: {
        id: 'uuid',
        projectId: 'uuid',
        investorId: 'uuid',
        amount: 5000,
        date: '2024-03-29T12:00:00.000Z'
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Données invalides' })
  @ApiResponse({ status: 401, description: 'Non autorisé' })
  @ApiResponse({ status: 403, description: 'Rôle invalide' })
  create(@Body() createInvestmentDto: CreateInvestmentDto, @Request() req) {
    // Obtenir l'ID de l'utilisateur à partir du token JWT
    const userId = req.user.sub;
    return this.investmentsService.create(createInvestmentDto, userId);
  }

  @Get()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Lister tous les investissements' })
  @ApiResponse({
    status: 200,
    description: 'Liste des investissements récupérée avec succès',
    schema: {
      example: [{
        id: 'uuid',
        projectId: 'uuid',
        investorId: 'uuid',
        amount: 5000,
        date: '2024-03-29T12:00:00.000Z'
      }]
    }
  })
  @ApiResponse({ status: 401, description: 'Non autorisé' })
  @ApiResponse({ status: 403, description: 'Rôle invalide' })
  findAll() {
    return this.investmentsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer un investissement par son ID' })
  @ApiParam({ name: 'id', description: 'ID de l\'investissement' })
  @ApiResponse({
    status: 200,
    description: 'Investissement récupéré avec succès',
    schema: {
      example: {
        id: 'uuid',
        projectId: 'uuid',
        investorId: 'uuid',
        amount: 5000,
        date: '2024-03-29T12:00:00.000Z'
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Investissement non trouvé' })
  findOne(@Param('id') id: string) {
    return this.investmentsService.findOne(id);
  }

  @Get('user/me')
  @ApiOperation({ summary: 'Lister mes investissements' })
  @ApiResponse({
    status: 200,
    description: 'Liste de mes investissements récupérée avec succès',
    schema: {
      example: [{
        id: 'uuid',
        projectId: 'uuid',
        investorId: 'uuid',
        amount: 5000,
        date: '2024-03-29T12:00:00.000Z'
      }]
    }
  })
  @ApiResponse({ status: 401, description: 'Non autorisé' })
  findMyInvestments(@Request() req) {
    const userId = req.user.sub;
    return this.investmentsService.findByUser(userId);
  }

  @Get('project/:projectId')
  @ApiOperation({ summary: 'Lister les investissements d\'un projet' })
  @ApiParam({ name: 'projectId', description: 'ID du projet' })
  @ApiResponse({
    status: 200,
    description: 'Liste des investissements du projet récupérée avec succès',
    schema: {
      example: [{
        id: 'uuid',
        projectId: 'uuid',
        investorId: 'uuid',
        amount: 5000,
        date: '2024-03-29T12:00:00.000Z'
      }]
    }
  })
  @ApiResponse({ status: 404, description: 'Projet non trouvé' })
  findByProject(@Param('projectId') projectId: string) {
    return this.investmentsService.findByProject(projectId);
  }
} 