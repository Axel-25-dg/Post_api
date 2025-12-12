import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true, nullable: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: true })
  isActive: boolean;
  
  @Column({ nullable: true })
  profile: string;
}