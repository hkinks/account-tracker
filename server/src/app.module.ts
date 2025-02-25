import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionsModule } from './transactions/transactions.module';
import { TagsModule } from './tags/tags.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TerminusModule } from '@nestjs/terminus';
import { AccountsModule } from './accounts/accounts.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DB_URL || (() => { throw new Error('DB_URL is not set') })(),
      autoLoadEntities: true,
      synchronize: true, // set to false in production
    }),
    TerminusModule,
    TransactionsModule,
    TagsModule,
    AccountsModule,
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}