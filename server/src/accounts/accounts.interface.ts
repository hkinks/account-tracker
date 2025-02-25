import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsNumber, IsBoolean } from 'class-validator';

export class CreateAccountDto {
  @ApiProperty({ example: 'Savings Account' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'My primary savings account', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 1000.50, required: false })
  @IsOptional()
  @IsNumber()
  balance?: number;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ example: 'savings', required: false })
  @IsOptional()
  @IsString()
  accountType?: string;
}


export class UpdateAccountDto extends PartialType(CreateAccountDto) {}