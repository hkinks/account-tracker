import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BalanceRecord } from './balance-records.entity';
import {
  BalanceRecordDto,
  CreateBalanceRecordDto,
  UpdateBalanceRecordDto,
} from './balance-records.interface';
import { Account } from 'src/accounts/accounts.entity';
import { CurrencyConverterService } from '../currency/currency-converter.service';

@Injectable()
export class BalanceRecordsService {
  constructor(
    @InjectRepository(BalanceRecord)
    private balanceRecordsRepository: Repository<BalanceRecord>,
    @InjectRepository(Account)
    private accountsRepository: Repository<Account>,
    private currencyConverterService: CurrencyConverterService,
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

  async findAllWithEurValues(): Promise<BalanceRecordDto[]> {
    const balanceRecords = await this.balanceRecordsRepository.find({
      relations: ['account'],
    });
    
    // Process records to add EUR values for crypto accounts
    const processedRecords = await Promise.all(
      balanceRecords.map(async (record) => {
        const dto = new BalanceRecordDto();
        dto.id = record.id;
        dto.balance = Number(record.balance);
        dto.recordedAt = record.recordedAt;
        dto.accountId = record.accountId;
        dto.account = record.account;
        
        // If this is a crypto account, add EUR value
        if (record.account.accountType === 'crypto' && record.account.currency) {
          try {
            dto.eurValue = await this.currencyConverterService.convertCryptoToEur(
              Number(record.balance),
              record.account.currency
            );
          } catch (error) {
            console.error(`Failed to convert ${record.account.currency} to EUR:`, error);
          }
        }
        
        return dto;
      })
    );
    
    return processedRecords;
  }

  findByAccountId(accountId: string): Promise<BalanceRecordDto[]> {
    return this.balanceRecordsRepository.find({
      where: { accountId },
      relations: ['account'],
      order: { recordedAt: 'DESC' },
    });
  }

  findOne(id: string): Promise<BalanceRecordDto> {
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
