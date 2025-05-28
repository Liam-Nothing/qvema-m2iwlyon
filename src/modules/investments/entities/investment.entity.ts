import { 
  Entity, 
  Column, 
  PrimaryGeneratedColumn, 
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Project } from '../../projects/entities/project.entity';

@Entity('investments')
export class Investment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @CreateDateColumn()
  date: Date;

  @ManyToOne(() => Project, project => project.investments)
  project: Project;

  @Column()
  projectId: string;

  @ManyToOne(() => User, user => user.investments)
  investor: User;

  @Column()
  investorId: string;

  @UpdateDateColumn()
  updatedAt: Date;
} 