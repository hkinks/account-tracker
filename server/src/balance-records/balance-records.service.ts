import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BalanceRecord } from './balance-records.entity';
import {
  CreateBalanceRecordDto,
  UpdateBalanceRecordDto,
} from './balance-records.interface';
import { Account } from 'src/accounts/accounts.entity';

@Injectable()
export class BalanceRecordsService {
  constructor(
    @InjectRepository(BalanceRecord)
    private balanceRecordsRepository: Repository<BalanceRecord>,
    @InjectRepository(Account)
    private accountsRepository: Repository<Account>,
  ) {}

  async create(
    createBalanceRecordDto: CreateBalanceRecordDto,
  ): Promise<BalanceRecord> {
    // Ensure accountId is present in the DTO
    if (!createBalanceRecordDto.accountId) {
      throw new Error('accountId is required to create a balance record');
    }
    
    const balanceRecord = this.balanceRecordsRepository.create(
      createBalanceRecordDto,
    );
    await this.balanceRecordsRepository.save(balanceRecord);

    // update the account balance also
    const account = await this.accountsRepository.findOne({
      where: { id: balanceRecord.accountId },
    });
    
    if (!account) {
      throw new Error(`Account with id ${balanceRecord.accountId} not found`);
    }
    account.balance = balanceRecord.balance;
    await this.accountsRepository.save(account);

    return balanceRecord;
  }

  async findAll(): Promise<BalanceRecord[]> {
    const balanceRecords = await this.balanceRecordsRepository.find({
      relations: ['account'],
    });
    return balanceRecords.map((record) => ({
      ...record,
      balance: Number(record.balance),
    }));
  }

  findByAccountId(accountId: string): Promise<BalanceRecord[]> {
    return this.balanceRecordsRepository.find({
      where: { accountId },
      relations: ['account'],
      order: { recordedAt: 'DESC' },
    });
  }

  findOne(id: string): Promise<BalanceRecord> {
    return this.balanceRecordsRepository.findOne({
      where: { id },
      relations: ['account'],
    });
  }

  async update(
    id: string,
    updateBalanceRecordDto: UpdateBalanceRecordDto,
  ): Promise<BalanceRecord> {
    await this.balanceRecordsRepository.update(id, updateBalanceRecordDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.balanceRecordsRepository.delete(id);
  }
}
