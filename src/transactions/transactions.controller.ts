import { Controller, Get } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { BankTransaction } from './transactions.entity';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}
  
  @Get()
  getTransactions(): Promise<BankTransaction[]> {
    return this.transactionsService.getTransactions();
  }
}
