import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './accounts.entity';
import { AccountsService } from './accounts.service';
import { AccountsController } from './accounts.controller';
import { CryptoTickerService } from '../crypto/crypto-ticker.service';
import { CurrencyConverterService } from 'src/currency/currency-converter.service';
import { BalanceRecord } from 'src/balance-records/balance-records.entity';
import { BalanceRecordsService } from 'src/balance-records/balance-records.service';

@Module({
  imports: [TypeOrmModule.forFeature([Account, BalanceRecord])],
  controllers: [AccountsController],
  providers: [AccountsService, CryptoTickerService, CurrencyConverterService, BalanceRecordsService],
  exports: [AccountsService, TypeOrmModule.forFeature([Account, BalanceRecord])],
})
export class AccountsModule {}
