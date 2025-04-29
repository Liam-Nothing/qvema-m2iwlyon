import { IsString, IsNumber, Min } from 'class-validator';

export class CreateInvestmentDto {
  @IsString()
  projectId: string;

  @IsNumber()
  @Min(0)
  amount: number;
} 