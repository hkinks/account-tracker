import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, PrimaryColumn, JoinColumn } from 'typeorm';
import { BankTransaction } from '../transactions/transactions.entity';
import { BalanceRecord } from '../balance-records/balance-records.entity';

export enum AccountType {
  BANK = 'bank',
  CRYPTO = 'crypto', 
  STOCKS = 'stocks',
  SAVINGS = 'savings',
  CASH = 'cash',
  OTHER = 'other'
}

@Entity('account')
export class Account {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  accountNumber: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
    transformer: {
      to: (value: number) => value,
      from: (value: string | number) => Number(value),
    },
  })
  balance: number;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: false, default: 'EUR' })
  currency: string;

  @Column({ nullable: true })
  lastUpdated: Date;

  @OneToMany(() => BankTransaction, (transaction) => transaction.account)
  transactions: BankTransaction[];

  @OneToMany(() => BalanceRecord, (balanceRecord) => balanceRecord.account)
  balanceRecords: BalanceRecord[];

  @Column({
    type: 'enum',
    enum: AccountType,
    default: AccountType.BANK,
    nullable: false
  })
  accountType: AccountType;
}