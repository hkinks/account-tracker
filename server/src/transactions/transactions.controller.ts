import { Body, Controller, Delete, Get, Param, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { BankTransaction } from './transactions.entity';
import { CreateTransactionDto, TransactionDto } from './transactions.interface';

function convertAmountToString(transaction: TransactionDto): BankTransaction {
  return {
    ...transaction,
    amount: transaction.amount.toString(),
    tag: transaction.tag || null,
    tagEntity: null,
    tagId: null
  };
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
