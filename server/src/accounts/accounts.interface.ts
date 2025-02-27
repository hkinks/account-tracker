import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
} from 'class-validator';
import { AccountType } from './accounts.entity';

export class CreateAccountDto {
  @ApiProperty({ example: 'Savings Account' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'My primary savings account', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 1000.5, required: false })
  @IsOptional()
  @IsNumber()
  balance?: number;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ example: '2021-01-01', required: false })
  @IsOptional()
  @IsString()
  lastUpdated?: string;

  @ApiProperty({ example: 'EUR', required: false })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiProperty({ example: '1234567890', required: false })
  @IsOptional()
  @IsString()
  accountNumber?: string;

  @ApiProperty({ example: 'bank', required: false })
  @IsOptional()
  @IsString()
  accountType?: AccountType;
}

export class UpdateAccountDto extends PartialType(CreateAccountDto) {}
