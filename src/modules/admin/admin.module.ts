import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { UsersModule } from '../users/users.module';
import { InvestmentsModule } from '../investments/investments.module';

@Module({
  imports: [UsersModule, InvestmentsModule],
  controllers: [AdminController],
})
export class AdminModule {} 