import { Entity, Column, PrimaryGeneratedColumn, Unique } from 'typeorm';

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
  amount: number;

  @Column({ type: 'varchar', nullable: false, default: 'EUR' })
  currency: string;

  @Column({ type: 'varchar', nullable: false })
  sender: string;

  @Column({ type: 'varchar', nullable: false })
  receiver: string;
} 