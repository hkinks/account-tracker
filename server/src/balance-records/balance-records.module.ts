import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BalanceRecordsService } from './balance-records.service';
import { BalanceRecordsController } from './balance-records.controller';
import { BalanceRecord } from './balance-records.entity';
import { Account } from 'src/accounts/accounts.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BalanceRecord, Account])],
  controllers: [BalanceRecordsController],
  providers: [BalanceRecordsService],
  exports: [BalanceRecordsService],
})
export class BalanceRecordsModule {}
