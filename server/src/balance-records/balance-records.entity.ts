import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Account } from '../accounts/accounts.entity';

@Entity('balance_record')
export class BalanceRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('decimal', { precision: 10, scale: 2 })
  balance: number;

  @Column('timestamp with time zone')
  recordedAt: Date;

  @ManyToOne(() => Account, account => account.balanceRecords)
  account: Account;

  @Column()
  accountId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 