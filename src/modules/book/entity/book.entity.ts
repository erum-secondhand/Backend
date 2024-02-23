import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../../../global/common/base.entity';

@Entity()
export class Book extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  imageUrl: string;

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
