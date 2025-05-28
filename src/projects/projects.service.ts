import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from '../modules/projects/entities/project.entity';
import { User } from '../modules/users/entities/user.entity';
import { CreateProjectDto, UpdateProjectDto } from './dto/project.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createProjectDto: CreateProjectDto, userId: string): Promise<Project> {
    const owner = await this.usersRepository.findOne({ where: { id: userId } });
    if (!owner) {
      throw new NotFoundException('User not found');
    }

    const project = this.projectsRepository.create({
      ...createProjectDto,
      owner,
    });

    return this.projectsRepository.save(project);
  }

  async findAll(): Promise<Project[]> {
    return this.projectsRepository.find({
      relations: ['owner', 'investments', 'investments.investor'],
    });
  }

  async findOne(id: string): Promise<Project> {
    const project = await this.projectsRepository.findOne({
      where: { id },
      relations: ['owner', 'investments', 'investments.investor'],
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    return project;
  }

  async update(id: string, updateProjectDto: UpdateProjectDto, userId: string): Promise<Project> {
    const project = await this.findOne(id);

    // Vérifiez que l'utilisateur est le propriétaire du projet
    if (project.owner.id !== userId) {
      throw new ForbiddenException('You do not have permission to update this project');
    }

    // Mise à jour du projet
    Object.assign(project, updateProjectDto);
    return this.projectsRepository.save(project);
  }

  async remove(id: string, userId: string): Promise<void> {
    const project = await this.findOne(id);

    // Vérifiez que l'utilisateur est le propriétaire du projet
    if (project.owner.id !== userId) {
      throw new ForbiddenException('You do not have permission to delete this project');
    }

    await this.projectsRepository.remove(project);
  }

  async findByUser(userId: string): Promise<Project[]> {
    return this.projectsRepository.find({
      where: { owner: { id: userId } },
      relations: ['investments', 'investments.investor'],
    });
  }
} 