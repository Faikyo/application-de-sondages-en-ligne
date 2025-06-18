import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Unique } from 'typeorm';
import { Poll } from './poll.entity';
import { Option } from './option.entity';

@Entity()
@Unique(['poll', 'voter'])  // Uniqueness pour éviter le double vote par même votant
export class Vote {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  voter: string;    

  // Le sondage concerné par le vote
  @ManyToOne(type => Poll, poll => poll.votes, { onDelete: 'CASCADE' })
  poll: Poll;

  // L’option choisie (dans ce sondage)
  @ManyToOne(type => Option, { onDelete: 'CASCADE' })
  option: Option;
}