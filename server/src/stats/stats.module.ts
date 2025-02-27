import { Module } from '@nestjs/common';
import { StatsController } from './stats.controller';
import { AccountsModule } from '../accounts/accounts.module';
import { BalanceRecordsModule } from '../balance-records/balance-records.module';

@Module({
  imports: [AccountsModule, BalanceRecordsModule],
  controllers: [StatsController],
})
export class StatsModule {}
