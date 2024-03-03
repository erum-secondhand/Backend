import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../../../global/common/base.entity';

export enum SalesStatus {
  ON_SALE = '판매중',
  SOLD_OUT = '판매완료',
}

@Entity()
export class Book extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 1000 })
  imageUrls: string;

  get imageUrlsArray(): string[] {
    return JSON.parse(this.imageUrls);
  }

  set imageUrlsArray(urls: string[]) {
    this.imageUrls = JSON.stringify(urls);
  }

  @Column()
  title: string;

  @Column()
  publisher: string;

  @Column()
  grade: string;

  @Column()
  price: string;

  @Column({ type: 'varchar', length: 1000 })
  description: string;

  @Column()
  condition: string;

  @Column()
  kakaoLink: string;

  @Column({
    type: 'enum',
    enum: SalesStatus,
    default: SalesStatus.ON_SALE,
  })
  salesStatus: SalesStatus;
}
