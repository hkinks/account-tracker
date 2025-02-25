import { Body, Controller, Delete, Get, Param, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { BankTransaction } from './transactions.entity';
import { IsDate, IsNumber, IsString, IsNotEmpty, MinLength, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

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

function convertAmountToString(transaction: TransactionDto): BankTransaction {
  return {
    ...transaction,
    amount: transaction.amount.toString(),
    tag: transaction.tag || null
  };
}

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

  @ApiProperty({ example: 'Tag', required: false })
  tag?: string;
}

@Controller('transactions')
export class TransactionsController {
  constructor(
    private readonly transactionsService: TransactionsService
  ) {}
  
  @Get()
  async getTransactions(): Promise<TransactionDto[]> {
    const transactions: BankTransaction[] = await this.transactionsService.getTransactions();
    const response: TransactionDto[] = transactions.map(transaction => ({
      ...transaction,
      amount: Number(transaction.amount)
    }));
    return response;
  }

  @Get(':id')
  async getTransactionById(@Param('id') id: number): Promise<TransactionDto> {
    const transaction: BankTransaction = await this.transactionsService.getTransactionById(id);
    return {
      ...transaction,
      amount: Number(transaction.amount)
    };
  }

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async createTransaction(@Body() transaction: CreateTransactionDto): Promise<TransactionDto> {
    console.log('Creating transaction:', transaction);
    const newTransaction: BankTransaction = await this.transactionsService.createTransaction(convertAmountToString(transaction));
    return {
      ...newTransaction,
      amount: Number(newTransaction.amount)
    };
  }

  @Put(':id')
  async updateTransaction(@Param('id') id: number, @Body() transaction: TransactionDto): Promise<TransactionDto> {
    const transactionWithAmountString: BankTransaction = convertAmountToString(transaction);

    const updatedTransaction: BankTransaction = await this.transactionsService.updateTransaction(id, transactionWithAmountString);
    return {
      ...updatedTransaction,
      amount: Number(updatedTransaction.amount)
    };
  }

  @Delete(':id')
  async deleteTransaction(@Param('id') id: number): Promise<void> {
    console.log('Deleting transaction with id:', id);
    await this.transactionsService.deleteTransaction(id);
  }
}
