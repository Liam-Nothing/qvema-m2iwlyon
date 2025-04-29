import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Interest } from './entities/interest.entity';

@Injectable()
export class InterestsService {
  constructor(
    @InjectRepository(Interest)
    private interestsRepository: Repository<Interest>,
  ) {}

  async findAll(): Promise<Interest[]> {
    return this.interestsRepository.find();
  }

  async findOne(id: string): Promise<Interest> {
    return this.interestsRepository.findOneOrFail({ where: { id } });
  }

  async create(interest: Partial<Interest>): Promise<Interest> {
    const newInterest = this.interestsRepository.create(interest);
    return this.interestsRepository.save(newInterest);
  }

  async update(id: string, interest: Partial<Interest>): Promise<Interest> {
    await this.interestsRepository.update(id, interest);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.interestsRepository.delete(id);
  }
} 