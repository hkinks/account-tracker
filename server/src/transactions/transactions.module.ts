import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { BankTransaction } from './transactions.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BankTransaction])],
  controllers: [TransactionsController],
  providers: [TransactionsService]
})
export class TransactionsModule {}
