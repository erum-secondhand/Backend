import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { BaseEntity } from '../../../global/common/base.entity';
import { User } from '../../user/entity/user.entity';

@Entity()
export class Book extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 1000 })
  imageUrls: string;

  get imageUrlsArray(): string[] {
    if (!this.imageUrls || this.imageUrls.trim() === "") {
      return [];
    }
  
    try {
      return JSON.parse(this.imageUrls);
    } catch (e) {
      console.error('Error parsing imageUrls:', this.imageUrls, e);
      return [];
    }
  }

  set imageUrlsArray(urls: string[] | undefined) {
    this.imageUrls = urls ? JSON.stringify(urls) : '[]';
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
  type: string;

  @Column()
  condition: string;

  @Column()
  kakaoLink: string;

  @Column()
  salesStatus: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ nullable: false })
  userId: number;
}
