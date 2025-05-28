import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { Project } from '../modules/projects/entities/project.entity';
import { User } from '../modules/users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Project, User]),
  ],
  controllers: [ProjectsController],
  providers: [ProjectsService],
  exports: [ProjectsService],
})
export class ProjectsModule {} 