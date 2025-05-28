import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiParam, ApiBody, ApiResponse } from '@nestjs/swagger';

@ApiTags('Projets')
@ApiBearerAuth('access-token')
@Controller('projects')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @Roles(UserRole.ENTREPRENEUR)
  @ApiOperation({ summary: 'Créer un nouveau projet' })
  @ApiBody({ type: CreateProjectDto })
  @ApiResponse({ 
    status: 201, 
    description: 'Projet créé avec succès',
    type: CreateProjectDto 
  })
  @ApiResponse({ status: 401, description: 'Non autorisé' })
  @ApiResponse({ status: 403, description: 'Rôle invalide' })
  create(@Body() createProjectDto: CreateProjectDto, @Request() req) {
    return this.projectsService.create(createProjectDto, req.user.sub);
  }

  @Get()
  @ApiOperation({ summary: 'Récupérer tous les projets' })
  @ApiResponse({ 
    status: 200, 
    description: 'Liste des projets récupérée avec succès',
    type: [CreateProjectDto] 
  })
  findAll() {
    return this.projectsService.findAll();
  }

  @Get('me')
  @ApiOperation({ summary: 'Récupérer mes projets' })
  @ApiResponse({ 
    status: 200, 
    description: 'Liste de mes projets récupérée avec succès',
    type: [CreateProjectDto] 
  })
  @ApiResponse({ status: 401, description: 'Non autorisé' })
  findMyProjects(@Request() req) {
    return this.projectsService.findByUser(req.user.sub);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer un projet par son ID' })
  @ApiParam({ name: 'id', description: 'ID du projet' })
  @ApiResponse({ 
    status: 200, 
    description: 'Projet récupéré avec succès',
    type: CreateProjectDto 
  })
  @ApiResponse({ status: 404, description: 'Projet non trouvé' })
  findOne(@Param('id') id: string) {
    return this.projectsService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ENTREPRENEUR)
  @ApiOperation({ summary: 'Mettre à jour un projet' })
  @ApiParam({ name: 'id', description: 'ID du projet' })
  @ApiBody({ type: UpdateProjectDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Projet mis à jour avec succès',
    type: CreateProjectDto 
  })
  @ApiResponse({ status: 401, description: 'Non autorisé' })
  @ApiResponse({ status: 403, description: 'Accès interdit' })
  @ApiResponse({ status: 404, description: 'Projet non trouvé' })
  update(
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
    @Request() req,
  ) {
    return this.projectsService.update(id, updateProjectDto, req.user.sub);
  }

  @Delete(':id')
  @Roles(UserRole.ENTREPRENEUR)
  @ApiOperation({ summary: 'Supprimer un projet' })
  @ApiParam({ name: 'id', description: 'ID du projet' })
  @ApiResponse({ status: 200, description: 'Projet supprimé avec succès' })
  @ApiResponse({ status: 401, description: 'Non autorisé' })
  @ApiResponse({ status: 403, description: 'Accès interdit' })
  @ApiResponse({ status: 404, description: 'Projet non trouvé' })
  remove(@Param('id') id: string, @Request() req) {
    return this.projectsService.remove(id, req.user.sub);
  }
} 