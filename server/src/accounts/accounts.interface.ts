import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsEnum,
} from 'class-validator';
import { AccountType } from './accounts.entity';

// Base class that will be used for all account-related DTOs
export class AccountDto {
  @ApiProperty({ example: 'abc123', required: false })
  @IsOptional()
  @IsString()
  id?: string;

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

  @ApiProperty({ example: 'EUR', required: false })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiProperty({ example: 1050.75, required: false })
  @IsOptional()
  @IsNumber()
  eurValue?: number;

  @ApiProperty({ 
    example: 'bank', 
    required: false, 
    enum: AccountType,
    enumName: 'AccountType'
  })
  @IsOptional()
  @IsEnum(AccountType)
  accountType?: AccountType;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ example: '2021-01-01', required: false, default: new Date().toISOString() })
  @IsOptional()
  @IsString()
  lastUpdated?: string;

  @ApiProperty({ example: '1234567890', required: false })
  @IsOptional()
  @IsString()
  accountNumber?: string;
}