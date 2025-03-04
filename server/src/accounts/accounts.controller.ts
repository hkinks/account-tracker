import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { Account } from './accounts.entity';
import { AccountDto } from './accounts.interface';
import { AccountsService } from './accounts.service';

@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post()
  create(@Body() accountDto: AccountDto): Promise<Account> {
    return this.accountsService.create(accountDto);
  }

  @Get()
  findAll(): Promise<AccountDto[]> {
    return this.accountsService.findAllWithEurValues();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Account> {
    return this.accountsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() accountDto: AccountDto,
  ): Promise<Account> {
    return this.accountsService.update(id, accountDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.accountsService.remove(id);
  }
}
