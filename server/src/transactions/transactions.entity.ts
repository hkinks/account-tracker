import { Account } from 'src/accounts/accounts.entity';
import { Tag } from '../tags/tags.entity';
import { Entity, Column, PrimaryGeneratedColumn, Unique, ManyToOne, JoinColumn } from 'typeorm';

@Entity('bank_transactions')
@Unique(['date', 'sender', 'receiver', 'description', 'amount', 'currency'])
export class BankTransaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date', nullable: false })
  date: Date;

  @Column({ type: 'varchar', nullable: false })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  amount: string;  //In TypeORM, when you use the decimal type for a column, the value is returned as a string by default.

  @Column({ type: 'varchar', nullable: false, default: 'EUR' })
  currency: string;

  @Column({ type: 'varchar', nullable: false })
  sender: string;

  @Column({ type: 'varchar', nullable: false })
  receiver: string;

  @Column({ nullable: true })
  tag: string;

  @ManyToOne(() => Tag, tag => tag.transactions, { nullable: true })
  @JoinColumn({ name: 'tagId' })
  tagEntity: Tag;

  @Column({ nullable: true })
  tagId: number;

  @Column({ nullable: true })
  accountId: string;

  @ManyToOne(() => Account, account => account.transactions, { nullable: true })
  @JoinColumn({ name: 'accountId' })
  account: Account;
} 