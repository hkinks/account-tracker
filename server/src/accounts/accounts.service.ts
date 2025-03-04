import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account, AccountType } from './accounts.entity';
import { AccountDto } from './accounts.interface';
import { CryptoTickerService } from 'src/crypto/crypto-ticker.service';

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(Account)
    private accountsRepository: Repository<Account>,
    private cryptoTickerService: CryptoTickerService,
  ) {}

  async create(accountDto: AccountDto): Promise<Account> {
    // Explicitly convert string to enum if needed
    let accountType = accountDto.accountType;
    if (typeof accountType === 'string') {
      accountType = accountType as AccountType;
    }
    
    const account = this.accountsRepository.create({
      ...accountDto,
      accountType: accountType || AccountType.BANK
    });
    
    return this.accountsRepository.save(account);
  }

  async findAll(): Promise<Account[]> {
    return this.accountsRepository.find();
  }

  async findAllWithEurValues(): Promise<AccountDto[]> {
    const accounts = await this.findAll();
    const accountDTOs: AccountDto[] = [];

    for (const account of accounts) {
      let eurValue = account.balance;

      // Handle crypto accounts
      if (account.accountType === AccountType.CRYPTO && account.currency) {
        const cryptoPrice = await this.cryptoTickerService.getCurrentPrice(account.currency + 'USDT');
        eurValue = account.balance * cryptoPrice.price;
      }

      accountDTOs.push({
        id: account.id,
        name: account.name,
        balance: account.balance,
        currency: account.currency,
        eurValue: eurValue,
        accountType: account.accountType,
        description: account.description,
        lastUpdated: account.lastUpdated?.toISOString()
      });
    }

    return accountDTOs;
  }

  async findOne(id: string): Promise<Account> {
    const account = await this.accountsRepository.findOne({ where: { id } });
    if (!account) {
      throw new NotFoundException(`Account with ID ${id} not found`);
    }
    return account;
  }

  async update(
    id: string,
    accountDto: AccountDto,
  ): Promise<Account> {
    const account = await this.findOne(id);
    this.accountsRepository.merge(account, accountDto);
    account.lastUpdated = new Date(accountDto.lastUpdated || Date.now());
    return this.accountsRepository.save(account);
  }

  async remove(id: string): Promise<void> {
    const result = await this.accountsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Account with ID ${id} not found`);
    }
  }
}
