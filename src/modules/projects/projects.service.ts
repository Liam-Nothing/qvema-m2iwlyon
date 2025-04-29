import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Interest } from '../interests/entities/interest.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
    @InjectRepository(Interest)
    private interestsRepository: Repository<Interest>,
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

    if (createProjectDto.interestIds) {
      const interests = await this.interestsRepository.findByIds(createProjectDto.interestIds);
      project.interests = interests;
    }

    return this.projectsRepository.save(project);
  }

  async findAll(): Promise<Project[]> {
    return this.projectsRepository.find({
      relations: ['owner', 'interests'],
    });
  }

  async findOne(id: string): Promise<Project> {
    const project = await this.projectsRepository.findOne({
      where: { id },
      relations: ['owner', 'interests'],
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

    if (updateProjectDto.interestIds) {
      const interests = await this.interestsRepository.findByIds(updateProjectDto.interestIds);
      project.interests = interests;
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

  async findRecommended(userId: string): Promise<Project[]> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['interests'],
    });

    if (!user || !user.interests.length) {
      return this.findAll();
    }

    const userInterestIds = user.interests.map(interest => interest.id);
    return this.projectsRepository
      .createQueryBuilder('project')
      .leftJoinAndSelect('project.interests', 'interest')
      .leftJoinAndSelect('project.owner', 'owner')
      .where('interest.id IN (:...interestIds)', { interestIds: userInterestIds })
      .getMany();
  }
} 