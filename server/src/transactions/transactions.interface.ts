import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsString, IsNotEmpty, MinLength, IsNumber, Min } from 'class-validator';


export class CreateTransactionDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: '2025-02-25T00:00:00Z' })
  @IsDate()
  @Type(() => Date)
  date: Date;

  @ApiProperty({ example: 'Test transaction', minLength: 3 })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  description: string;

  @ApiProperty({ example: 100.00, minimum: 0 })
  @IsNumber()
  @Min(0)
  amount: number;

  @ApiProperty({ example: 'EUR' })
  @IsString()
  @IsNotEmpty()
  currency: string;

  @ApiProperty({ example: 'John' })
  @IsString()
  @IsNotEmpty()
  sender: string;

  @ApiProperty({ example: 'Jane' })
  @IsString()
  @IsNotEmpty()
  receiver: string;

  @ApiProperty({ example: [1, 2, 3], required: false, type: [Number] })
  tagIds?: number[];
}
export interface TransactionDto {
  id: number;
  date: Date;
  description: string;
  amount: number;
  currency: string;
  sender: string;
  receiver: string;
  tag?: string;
}

