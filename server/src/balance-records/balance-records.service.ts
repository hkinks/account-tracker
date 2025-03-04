import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BalanceRecord } from './balance-records.entity';
import { BalanceRecordDto, UpdateBalanceRecordDto } from './balance-records.interface';
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
    createBalanceRecordDto: UpdateBalanceRecordDto,
  ): Promise<BalanceRecord> {
    // Ensure accountId is present in the DTO
    if (!createBalanceRecordDto.accountId) {
      throw new Error('accountId is required to create a balance record');
    }

    // if account is crypto, convert balance to EUR
    const account = await this.accountsRepository.findOne({
      where: { id: createBalanceRecordDto.accountId },
    });

    if (account.accountType === 'crypto') {
      createBalanceRecordDto.balance = await this.currencyConverterService.convertCryptoToEur(
        createBalanceRecordDto.balance,
        account.currency
      );
    }
    
    // create balance record
    const balanceRecord = this.balanceRecordsRepository.create(
      createBalanceRecordDto,
    );
    await this.balanceRecordsRepository.save(balanceRecord);

    return balanceRecord;
  }

  async findAll(): Promise<BalanceRecord[]> {
    return this.balanceRecordsRepository.find({
      relations: ['account'],
    });
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
  ): Promise<BalanceRecordDto> {
    await this.balanceRecordsRepository.update(id, updateBalanceRecordDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.balanceRecordsRepository.delete(id);
  }
}
