import { IsString, IsNumber, IsOptional, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProjectDto {
  @ApiProperty({
    example: 'Nouveau titre du projet',
    description: 'Titre du projet',
    required: false,
  })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({
    example: 'Nouvelle description du projet',
    description: 'Description complète du projet',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: 75000,
    description: 'Budget nécessaire pour le projet (en euros)',
    minimum: 0,
    required: false,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  budget?: number;

  @ApiProperty({
    example: 'Finance',
    description: 'Catégorie du projet',
    required: false,
  })
  @IsString()
  @IsOptional()
  category?: string;
} 