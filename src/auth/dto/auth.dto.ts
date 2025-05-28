import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, IsEnum } from 'class-validator';

export enum UserRole {
  ADMIN = 'admin',
  ENTREPRENEUR = 'entrepreneur',
  INVESTOR = 'investor',
}

export class RegisterDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Email de l\'utilisateur',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'Password123!',
    description: 'Mot de passe (minimum 8 caractères)',
  })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({
    example: 'John',
    description: 'Prénom de l\'utilisateur',
  })
  @IsString()
  firstname: string;

  @ApiProperty({
    example: 'Doe',
    description: 'Nom de l\'utilisateur',
  })
  @IsString()
  lastname: string;

  @ApiProperty({
    enum: UserRole,
    example: UserRole.ENTREPRENEUR,
    description: 'Rôle de l\'utilisateur',
  })
  @IsEnum(UserRole)
  role: UserRole;
}

export class LoginDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Email de l\'utilisateur',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'Password123!',
    description: 'Mot de passe de l\'utilisateur',
  })
  @IsString()
  password: string;
} 