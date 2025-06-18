import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Poll } from './poll.entity';

@Entity()
export class Option {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  text: string;

  // Chaque option est liée à un sondage
  @ManyToOne(type => Poll, poll => poll.options, { onDelete: 'CASCADE' })
  poll: Poll;
}