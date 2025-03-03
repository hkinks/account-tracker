import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { BalanceRecordsService } from './balance-records.service';
import { BalanceRecordDto, UpdateBalanceRecordDto } from './balance-records.interface';
import { BalanceRecord } from './balance-records.entity';
import { AccountsService } from 'src/accounts/accounts.service';

@ApiTags('Balance Records')
@Controller('balance-records')
export class BalanceRecordsController {
  constructor(
    private readonly balanceRecordsService: BalanceRecordsService,
    private readonly accountsService: AccountsService,
  ) { }

  @Post()
  @ApiOperation({ summary: 'Create a new balance record' })
  @ApiResponse({
    status: 201,
    description: 'The balance record has been created.',
  })
  create(
    @Body() createBalanceRecordDto: UpdateBalanceRecordDto,
  ): Promise<BalanceRecord> {
    const balanceRecord = this.balanceRecordsService.create(createBalanceRecordDto);
    this.accountsService.update(createBalanceRecordDto.accountId, {
      balance: createBalanceRecordDto.balance,
      id: createBalanceRecordDto.accountId,
    });

    return balanceRecord;
  }

  @Get()
  @ApiOperation({ summary: 'Get all balance records or filter by account' })
  @ApiResponse({ status: 200, description: 'Return all balance records.' })
  findAll(@Query('accountId') accountId?: string): Promise<BalanceRecordDto[]> {
    if (accountId) {
      return this.balanceRecordsService.findByAccountId(accountId);
    }
    return this.balanceRecordsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a balance record by id' })
  @ApiResponse({ status: 200, description: 'Return the balance record.' })
  findOne(@Param('id') id: string): Promise<BalanceRecordDto> {
    return this.balanceRecordsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a balance record' })
  @ApiResponse({
    status: 200,
    description: 'The balance record has been updated.',
  })
  update(
    @Param('id') id: string,
    @Body() updateBalanceRecordDto: UpdateBalanceRecordDto,
  ): Promise<BalanceRecordDto> {
    return this.balanceRecordsService.update(id, updateBalanceRecordDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a balance record' })
  @ApiResponse({
    status: 200,
    description: 'The balance record has been deleted.',
  })
  remove(@Param('id') id: string): Promise<void> {
    return this.balanceRecordsService.remove(id);
  }
}
