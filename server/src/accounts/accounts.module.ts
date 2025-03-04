import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './accounts.entity';
import { AccountsService } from './accounts.service';
import { AccountsController } from './accounts.controller';
import { CryptoTickerService } from '../crypto/crypto-ticker.service';

@Module({
  imports: [TypeOrmModule.forFeature([Account])],
  controllers: [AccountsController],
  providers: [AccountsService, CryptoTickerService],
  exports: [AccountsService, TypeOrmModule.forFeature([Account])],
})
export class AccountsModule {}
