import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BalanceRecord } from './balance-records.entity';
import {
  CreateBalanceRecordDto,
  UpdateBalanceRecordDto,
} from './balance-records.interface';

@Injectable()
export class BalanceRecordsService {
  constructor(
    @InjectRepository(BalanceRecord)
    private balanceRecordsRepository: Repository<BalanceRecord>,
  ) {}

  create(
    createBalanceRecordDto: CreateBalanceRecordDto,
  ): Promise<BalanceRecord> {
    const balanceRecord = this.balanceRecordsRepository.create(
      createBalanceRecordDto,
    );
    return this.balanceRecordsRepository.save(balanceRecord);
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
