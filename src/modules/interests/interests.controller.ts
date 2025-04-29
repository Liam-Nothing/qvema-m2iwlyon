import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { InterestsService } from './interests.service';
import { Interest } from './entities/interest.entity';

@Controller('interests')
export class InterestsController {
  constructor(private readonly interestsService: InterestsService) {}

  @Get()
  findAll(): Promise<Interest[]> {
    return this.interestsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Interest> {
    return this.interestsService.findOne(id);
  }

  @Post()
  create(@Body() interest: Partial<Interest>): Promise<Interest> {
    return this.interestsService.create(interest);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() interest: Partial<Interest>,
  ): Promise<Interest> {
    return this.interestsService.update(id, interest);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.interestsService.remove(id);
  }
} 