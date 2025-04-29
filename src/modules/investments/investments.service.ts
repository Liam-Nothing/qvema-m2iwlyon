import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Investment } from './entities/investment.entity';
import { CreateInvestmentDto } from './dto/create-investment.dto';
import { User } from '../users/entities/user.entity';
import { Project } from '../projects/entities/project.entity';
import { UserRole } from '../users/entities/user.entity';

@Injectable()
export class InvestmentsService {
  constructor(
    @InjectRepository(Investment)
    private investmentsRepository: Repository<Investment>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
  ) {}

  async create(createInvestmentDto: CreateInvestmentDto, investorId: string): Promise<Investment> {
    const investor = await this.usersRepository.findOneOrFail({ where: { id: investorId } });
    const project = await this.projectsRepository.findOneOrFail({
      where: { id: createInvestmentDto.projectId },
      relations: ['owner'],
    });

    if (investor.role !== UserRole.INVESTOR) {
      throw new ForbiddenException('Only investors can make investments');
    }

    if (project.ownerId === investorId) {
      throw new ForbiddenException('You cannot invest in your own project');
    }

    const investment = this.investmentsRepository.create({
      ...createInvestmentDto,
      investor,
      investorId,
      project,
    });

    return this.investmentsRepository.save(investment);
  }

  async findAll(): Promise<Investment[]> {
    return this.investmentsRepository.find({
      relations: ['investor', 'project'],
    });
  }

  async findOne(id: string): Promise<Investment> {
    const investment = await this.investmentsRepository.findOne({
      where: { id },
      relations: ['investor', 'project'],
    });

    if (!investment) {
      throw new NotFoundException(`Investment with ID ${id} not found`);
    }

    return investment;
  }

  async findByInvestor(investorId: string): Promise<Investment[]> {
    return this.investmentsRepository.find({
      where: { investorId },
      relations: ['project'],
    });
  }

  async findByProject(projectId: string): Promise<Investment[]> {
    return this.investmentsRepository.find({
      where: { projectId },
      relations: ['investor'],
    });
  }

  async remove(id: string, userId: string): Promise<void> {
    const investment = await this.findOne(id);

    if (investment.investorId !== userId) {
      throw new ForbiddenException('You can only delete your own investments');
    }

    await this.investmentsRepository.remove(investment);
  }
} 