import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BankTransaction } from './transactions.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(BankTransaction)
    private readonly transactionRepository: Repository<BankTransaction>,
  ) {}

  async getTransactions(): Promise<BankTransaction[]> {
    const transactions = await this.transactionRepository.find({
      order: {
        date: 'DESC',
      },
    });
    
    console.log('Found transactions:', transactions.length);
    console.log(transactions[0].amount)
    return transactions;
  }
}