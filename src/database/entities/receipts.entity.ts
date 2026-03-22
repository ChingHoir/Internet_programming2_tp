import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('receipts') // This will be the table name in Postgres
export class Receipt {
  @PrimaryGeneratedColumn('uuid')
  receiptId: string;

  @Column()
  issuedAt: Date;

  @Column()
  name: string;

  @Column('numeric') // Using numeric/decimal for prices
  price: number;
}
