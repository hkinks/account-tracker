import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account, AccountType } from './accounts.entity';
import { CreateAccountDto, UpdateAccountDto } from './accounts.interface';

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(Account)
    private accountsRepository: Repository<Account>,
  ) {}

  async create(createAccountDto: CreateAccountDto): Promise<Account> {
    console.log('createAccountDto', createAccountDto);
    console.log('accountType received:', createAccountDto.accountType);
    
    // Explicitly convert string to enum if needed
    let accountType = createAccountDto.accountType;
    if (typeof accountType === 'string') {
      accountType = accountType as AccountType;
    }
    
    const account = this.accountsRepository.create({
      ...createAccountDto,
      accountType: accountType || AccountType.BANK
    });
    
    console.log('account to be saved:', account);
    console.log('accountType to be saved:', account.accountType);
    
    return this.accountsRepository.save(account);
  }

  async findAll(): Promise<Account[]> {
    return this.accountsRepository.find();
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
    updateAccountDto: UpdateAccountDto,
  ): Promise<Account> {
    const account = await this.findOne(id);
    this.accountsRepository.merge(account, updateAccountDto);
    if (updateAccountDto.lastUpdated) {
      account.lastUpdated = new Date(updateAccountDto.lastUpdated);
    }
    return this.accountsRepository.save(account);
  }

  async remove(id: string): Promise<void> {
    const result = await this.accountsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Account with ID ${id} not found`);
    }
  }
}
