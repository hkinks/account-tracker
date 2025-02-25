import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { BankTransaction } from '../transactions/transactions.entity';

@Entity()
export class Account {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: 0 })
  balance: number;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  accountType: string;

  @OneToMany(() => BankTransaction, transaction => transaction.account)
  transactions: BankTransaction[];
}