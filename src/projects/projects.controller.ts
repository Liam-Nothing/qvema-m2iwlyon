import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  UseGuards,
  Request
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto, UpdateProjectDto } from './dto/project.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../modules/users/entities/user.entity';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Projets')
@ApiBearerAuth()
@Controller('projects')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @Roles(UserRole.ENTREPRENEUR)
  @ApiOperation({ summary: 'Créer un nouveau projet' })
  @ApiResponse({
    status: 201,
    description: 'Le projet a été créé avec succès',
    schema: {
      example: {
        id: 'uuid',
        title: 'Nouveau projet',
        description: 'Description du projet',
        budget: 10000,
        category: 'Technology',
        ownerId: 'uuid',
        createdAt: '2024-03-29T12:00:00.000Z'
      }
    }
  })
  @ApiResponse({
    status: 400,
    description: 'Données invalides'
  })
  @ApiResponse({
    status: 401,
    description: 'Non autorisé'
  })
  async create(@Body() createProjectDto: CreateProjectDto, @Request() req) {
    const userId = req.user.sub;
    return this.projectsService.create(createProjectDto, userId);
  }

  @Get()
  @ApiOperation({ summary: 'Lister tous les projets' })
  @ApiResponse({
    status: 200,
    description: 'Liste des projets récupérée avec succès',
    schema: {
      example: [{
        id: 'uuid',
        title: 'Projet 1',
        description: 'Description du projet 1',
        budget: 10000,
        category: 'Technology',
        ownerId: 'uuid',
        createdAt: '2024-03-29T12:00:00.000Z'
      }]
    }
  })
  async findAll() {
    return this.projectsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtenir un projet par son ID' })
  @ApiResponse({
    status: 200,
    description: 'Projet trouvé',
    schema: {
      example: {
        id: 'uuid',
        title: 'Projet 1',
        description: 'Description du projet 1',
        budget: 10000,
        category: 'Technology',
        ownerId: 'uuid',
        createdAt: '2024-03-29T12:00:00.000Z'
      }
    }
  })
  @ApiResponse({
    status: 404,
    description: 'Projet non trouvé'
  })
  async findOne(@Param('id') id: string) {
    return this.projectsService.findOne(id);
  }

  @Get('user/:userId')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Lister les projets d\'un utilisateur' })
  @ApiResponse({
    status: 200,
    description: 'Liste des projets récupérée avec succès',
    schema: {
      example: [{
        id: 'uuid',
        title: 'Projet 1',
        description: 'Description du projet 1',
        budget: 10000,
        category: 'Technology',
        ownerId: 'uuid',
        createdAt: '2024-03-29T12:00:00.000Z'
      }]
    }
  })
  @ApiResponse({
    status: 404,
    description: 'Utilisateur non trouvé'
  })
  async findByUser(@Param('userId') userId: string) {
    return this.projectsService.findByUser(userId);
  }

  @Get('user/me')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Lister les projets de l\'utilisateur connecté' })
  @ApiResponse({
    status: 200,
    description: 'Liste des projets récupérée avec succès',
    schema: {
      example: [{
        id: 'uuid',
        title: 'Projet 1',
        description: 'Description du projet 1',
        budget: 10000,
        category: 'Technology',
        ownerId: 'uuid',
        createdAt: '2024-03-29T12:00:00.000Z'
      }]
    }
  })
  @ApiResponse({
    status: 404,
    description: 'Utilisateur non trouvé'
  })
  async findMyProjects(@Request() req) {
    const userId = req.user.sub;
    return this.projectsService.findByUser(userId);
  }

  @Patch(':id')
  @Roles(UserRole.ENTREPRENEUR)
  @ApiOperation({ summary: 'Mettre à jour un projet' })
  @ApiResponse({
    status: 200,
    description: 'Projet mis à jour avec succès',
    schema: {
      example: {
        id: 'uuid',
        title: 'Projet mis à jour',
        description: 'Nouvelle description',
        budget: 15000,
        category: 'Technology',
        ownerId: 'uuid',
        updatedAt: '2024-03-29T12:00:00.000Z'
      }
    }
  })
  @ApiResponse({
    status: 403,
    description: 'Non autorisé à modifier ce projet'
  })
  @ApiResponse({
    status: 404,
    description: 'Projet non trouvé'
  })
  async update(
    @Param('id') id: string, 
    @Body() updateProjectDto: UpdateProjectDto,
    @Request() req
  ) {
    const userId = req.user.sub;
    return this.projectsService.update(id, updateProjectDto, userId);
  }

  @Delete(':id')
  @Roles(UserRole.ENTREPRENEUR)
  @ApiOperation({ summary: 'Supprimer un projet' })
  @ApiResponse({
    status: 200,
    description: 'Projet supprimé avec succès'
  })
  @ApiResponse({
    status: 403,
    description: 'Non autorisé à supprimer ce projet'
  })
  @ApiResponse({
    status: 404,
    description: 'Projet non trouvé'
  })
  async remove(@Param('id') id: string, @Request() req) {
    const userId = req.user.sub;
    return this.projectsService.remove(id, userId);
  }
} 