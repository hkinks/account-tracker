import { Injectable, ConflictException, BadRequestException } from '@nestjs/common';
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
    return transactions;
  }

  async getTransactionById(id: number): Promise<BankTransaction> {
    const transaction = await this.transactionRepository.findOne({
      where: { id },
    });
    return transaction;
  }

  async createTransaction(transaction: BankTransaction): Promise<BankTransaction> {
    if (transaction.id) {
      const existingTransactionById = await this.transactionRepository.findOne({
        where: { id: transaction.id }
      });
      if (existingTransactionById) {
        throw new ConflictException('DUPLICATE_ID', 'Transaction with the same ID already exists.');
      }
    }

    const existingTransaction = await this.transactionRepository.findOne({
      where: {
        date: transaction.date,
        sender: transaction.sender,
        receiver: transaction.receiver,
        description: transaction.description,
        amount: transaction.amount,
        currency: transaction.currency
      }
    });

    if (existingTransaction) {
      throw new ConflictException('DUPLICATE_TRANSACTION', 'Transaction with the same details already exists.');
    }

    const result = await this.transactionRepository.insert(transaction);
    return this.getTransactionById(result.identifiers[0].id);
  }

  async updateTransaction(id: number, transaction: BankTransaction): Promise<BankTransaction> {
    await this.transactionRepository.update(id, transaction);
    return this.getTransactionById(id);
  }
 
  async deleteTransaction(id: number): Promise<void> {
    await this.transactionRepository.delete(id);
  }
}