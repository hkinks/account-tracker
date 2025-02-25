import { Controller, Get } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { BankTransaction } from './transactions.entity';

export interface TransactionSchema {
  id: number;
  date: Date;
  description: string;
  amount: number;
  currency: string;
  sender: string;
  receiver: string;
}

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}
  
  @Get()
  async getTransactions(): Promise<TransactionSchema[]> {
    const transactions: BankTransaction[] = await this.transactionsService.getTransactions();
    const response: TransactionSchema[] = transactions.map(transaction => ({
      ...transaction,
      amount: Number(transaction.amount)
    }));
    return response;
  }
}
