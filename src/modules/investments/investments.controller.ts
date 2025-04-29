import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { InvestmentsService } from './investments.service';
import { CreateInvestmentDto } from './dto/create-investment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('investments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class InvestmentsController {
  constructor(private readonly investmentsService: InvestmentsService) {}

  @Post()
  @Roles(UserRole.INVESTOR)
  create(@Body() createInvestmentDto: CreateInvestmentDto, @Request() req) {
    return this.investmentsService.create(createInvestmentDto, req.user.id);
  }

  @Get()
  @Roles(UserRole.ADMIN)
  findAll() {
    return this.investmentsService.findAll();
  }

  @Get('my-investments')
  @Roles(UserRole.INVESTOR)
  findMyInvestments(@Request() req) {
    return this.investmentsService.findByInvestor(req.user.id);
  }

  @Get('project/:projectId')
  findProjectInvestments(@Param('projectId') projectId: string) {
    return this.investmentsService.findByProject(projectId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.investmentsService.findOne(id);
  }

  @Delete(':id')
  @Roles(UserRole.INVESTOR)
  remove(@Param('id') id: string, @Request() req) {
    return this.investmentsService.remove(id, req.user.id);
  }
} 