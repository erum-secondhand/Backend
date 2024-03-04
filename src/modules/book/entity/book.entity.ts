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
      const decodedUrls = decodeURIComponent(this.imageUrls);
      return JSON.parse(decodedUrls);
    } catch (e) {
      console.error('Error parsing imageUrls:', this.imageUrls, e);

      throw new Error('Invalid JSON format for imageUrls');
    }
  }

  set imageUrlsArray(urls: string[]) {
    if (!Array.isArray(urls)) {
      throw new Error('Invalid data type for imageUrlsArray. Expected an array.');
    }
    this.imageUrls = JSON.stringify(urls.map(url => encodeURIComponent(url)));
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
