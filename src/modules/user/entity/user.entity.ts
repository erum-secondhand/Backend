import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { BaseEntity } from '@global/common/base.entity';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, comment: '사용자 이메일' })
  email: string;

  @Column({ comment: '사용자 비밀번호', select: false })
  @Exclude()
  password: string;

  @Column({ comment: '사용자 이름' })
  name: string;

  @Column({ comment: '사용자 학번' })
  studentId: string;

  @Column({ comment: '사용자 전공' })
  major: string;
}
