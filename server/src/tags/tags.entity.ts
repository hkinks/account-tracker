import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { BankTransaction } from '../transactions/transactions.entity';

@Entity('tag')
export class Tag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true, default: '#CCCCCC' })
  color: string;

  @OneToMany(() => BankTransaction, transaction => transaction.tagEntity)
  transactions: BankTransaction[];
} 