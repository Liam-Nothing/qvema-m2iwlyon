import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Investment } from '../modules/investments/entities/investment.entity';
import { Project } from '../modules/projects/entities/project.entity';
import { User } from '../modules/users/entities/user.entity';
import { CreateInvestmentDto } from './dto/investment.dto';
import { UserRole } from '../modules/users/entities/user.entity';

@Injectable()
export class InvestmentsService {
  constructor(
    @InjectRepository(Investment)
    private investmentsRepository: Repository<Investment>,
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createInvestmentDto: CreateInvestmentDto, userId: string): Promise<Investment> {
    const investor = await this.usersRepository.findOne({ where: { id: userId } });
    if (!investor) {
      throw new NotFoundException('Investor not found');
    }

    // Vérifiez que l'utilisateur a le rôle INVESTOR
    if (investor.role !== UserRole.INVESTOR) {
      throw new ForbiddenException('Only investors can make investments');
    }

    const project = await this.projectsRepository.findOne({ 
      where: { id: createInvestmentDto.projectId },
      relations: ['owner']
    });
    if (!project) {
      throw new NotFoundException('Project not found');
    }

    // Empêchez l'utilisateur d'investir dans son propre projet
    if (project.owner.id === userId) {
      throw new ForbiddenException('Cannot invest in your own project');
    }

    const investment = this.investmentsRepository.create({
      amount: createInvestmentDto.amount,
      project,
      investor,
      date: new Date(),
    });

    return this.investmentsRepository.save(investment);
  }

  async findAll(): Promise<Investment[]> {
    return this.investmentsRepository.find({
      relations: ['project', 'investor'],
    });
  }

  async findOne(id: string): Promise<Investment> {
    const investment = await this.investmentsRepository.findOne({
      where: { id },
      relations: ['project', 'investor'],
    });

    if (!investment) {
      throw new NotFoundException(`Investment with ID ${id} not found`);
    }

    return investment;
  }

  async findByUser(userId: string): Promise<Investment[]> {
    return this.investmentsRepository.find({
      where: { investor: { id: userId } },
      relations: ['project', 'project.owner'],
    });
  }

  async findByProject(projectId: string): Promise<Investment[]> {
    return this.investmentsRepository.find({
      where: { project: { id: projectId } },
      relations: ['investor'],
    });
  }
} 