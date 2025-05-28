import { IsString, IsNotEmpty, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateInvestmentDto {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'ID du projet dans lequel investir',
  })
  @IsString()
  @IsNotEmpty()
  projectId: string;

  @ApiProperty({
    example: 5000,
    description: 'Montant de l\'investissement (en euros)',
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  amount: number;
} 