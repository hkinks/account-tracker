import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsDate, IsUUID } from 'class-validator';
import { Account } from 'src/accounts/accounts.entity';

export class UpdateBalanceRecordDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsNotEmpty()
  @IsUUID()
  accountId: string;

  @ApiProperty({ example: 1000.5 })
  @IsNotEmpty()
  @IsNumber()
  balance: number;

  @ApiProperty({ example: new Date() })
  @IsNotEmpty()
  @IsDate()
  recordedAt: Date;
}

export class BalanceRecordDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ example: 1000.5 })
  balance: number;

  @ApiProperty({ example: new Date() })
  recordedAt: Date;

  @ApiProperty({ example: 1000.5, required: false })
  eurValue?: number;

  @ApiProperty({ type: Account })
  account: Account;
}