import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { BalanceRecordsService } from './balance-records.service';
import { BalanceRecordsController } from './balance-records.controller';
import { BalanceRecord } from './balance-records.entity';
import { Account } from 'src/accounts/accounts.entity';
import { CurrencyConverterService } from '../services/currency/currency-converter.service';
import { CryptoTickerService } from '../services/crypto/crypto-ticker.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([BalanceRecord, Account]),
    ConfigModule
  ],
  controllers: [BalanceRecordsController],
  providers: [BalanceRecordsService, CurrencyConverterService, CryptoTickerService],
  exports: [BalanceRecordsService],
})
export class BalanceRecordsModule {}
