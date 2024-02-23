import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../../../global/common/base.entity';

@Entity()
export class Book extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
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
  price: number;

  @Column()
  description: string;

  @Column()
  condition: string;

  @Column()
  kakaoLink: string;
}
