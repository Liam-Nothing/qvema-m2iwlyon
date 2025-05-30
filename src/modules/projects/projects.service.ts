import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createProjectDto: CreateProjectDto, ownerId: string): Promise<Project> {
    const owner = await this.usersRepository.findOneOrFail({ where: { id: ownerId } });
    const project = this.projectsRepository.create({
      ...createProjectDto,
      owner,
      ownerId,
    });

    return this.projectsRepository.save(project);
  }

  async findAll(): Promise<Project[]> {
    return this.projectsRepository.find({
      relations: ['owner', 'investments'],
    });
  }

  async findOne(id: string): Promise<Project> {
    const project = await this.projectsRepository.findOne({
      where: { id },
      relations: ['owner', 'investments'],
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    return project;
  }

  async update(id: string, updateProjectDto: UpdateProjectDto, userId: string): Promise<Project> {
    const project = await this.findOne(id);

    if (project.ownerId !== userId) {
      throw new ForbiddenException('You can only update your own projects');
    }

    Object.assign(project, updateProjectDto);
    return this.projectsRepository.save(project);
  }

  async remove(id: string, userId: string): Promise<void> {
    const project = await this.findOne(id);

    if (project.ownerId !== userId) {
      throw new ForbiddenException('You can only delete your own projects');
    }

    await this.projectsRepository.remove(project);
  }

  async findByUser(userId: string): Promise<Project[]> {
    return this.projectsRepository.find({
      where: { owner: { id: userId } },
      relations: ['investments'],
    });
  }
} 