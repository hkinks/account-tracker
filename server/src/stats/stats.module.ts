import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { StatsController } from './stats.controller';
import { AccountsModule } from '../accounts/accounts.module';
import { BalanceRecordsModule } from '../balance-records/balance-records.module';
import { CurrencyConverterService } from '../currency/currency-converter.service';
import { CryptoTickerService } from '../crypto/crypto-ticker.service';

@Module({
  imports: [
    AccountsModule, 
    BalanceRecordsModule,
    ConfigModule
  ],
  controllers: [StatsController],
  providers: [CurrencyConverterService, CryptoTickerService],
})
export class StatsModule {}
