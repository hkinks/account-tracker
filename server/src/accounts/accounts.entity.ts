import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { BankTransaction } from '../transactions/transactions.entity';
import { BalanceRecord } from '../balance-records/balance-records.entity';

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

  @Column({ default: 0 })
  balance: number;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  accountType: string;

  @Column({ nullable: false, default: 'EUR' })
  currency: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  lastUpdated: Date;

  @OneToMany(() => BankTransaction, transaction => transaction.account)
  transactions: BankTransaction[];

  @OneToMany(() => BalanceRecord, balanceRecord => balanceRecord.account)
  balanceRecords: BalanceRecord[];
}