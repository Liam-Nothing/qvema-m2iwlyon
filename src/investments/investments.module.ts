import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvestmentsController } from './investments.controller';
import { InvestmentsService } from './investments.service';
import { Investment } from '../modules/investments/entities/investment.entity';
import { Project } from '../modules/projects/entities/project.entity';
import { User } from '../modules/users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Investment, Project, User]),
  ],
  controllers: [InvestmentsController],
  providers: [InvestmentsService],
  exports: [InvestmentsService],
})
export class InvestmentsModule {} 