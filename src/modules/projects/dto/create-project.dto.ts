import { IsString, IsNotEmpty, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProjectDto {
  @ApiProperty({
    example: 'Projet innovant',
    description: 'Titre du projet',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'Description détaillée du projet innovant',
    description: 'Description complète du projet',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    example: 50000,
    description: 'Budget nécessaire pour le projet (en euros)',
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  budget: number;

  @ApiProperty({
    example: 'Technologie',
    description: 'Catégorie du projet',
  })
  @IsString()
  @IsNotEmpty()
  category: string;
} 