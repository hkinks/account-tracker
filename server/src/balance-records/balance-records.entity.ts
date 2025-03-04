import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Account } from '../accounts/accounts.entity';

@Entity('balance_record')
export class BalanceRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: {
      to: (value: number) => value,
      from: (value: string | number) => Number(value),
    },
  })
  balance: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true, default: null, 
    transformer: {
      to: (value: number) => value,
      from: (value: string | number) => Number(value),
    }  
  })
  eurValue: number;

  @CreateDateColumn({ type: 'timestamp with time zone', nullable: true, default: () => 'CURRENT_TIMESTAMP' })
  recordedAt: Date;

  @ManyToOne(() => Account, (account) => account.balanceRecords)
  @JoinColumn({ name: 'accountId' })
  account: Account;

  @Column()
  accountId: string;
}
