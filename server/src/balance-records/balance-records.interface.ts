import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsDate, IsUUID } from 'class-validator';

export class CreateBalanceRecordDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsNotEmpty()
  @IsUUID()
  accountId: string;

  @ApiProperty({ example: 1000.50 })
  @IsNotEmpty()
  @IsNumber()
  balance: number;

  @ApiProperty({ example: new Date() })
  @IsNotEmpty()
  @IsDate()
  recordedAt: Date;
}

export class UpdateBalanceRecordDto extends CreateBalanceRecordDto {} 