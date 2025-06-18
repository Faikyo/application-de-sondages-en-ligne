import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Option } from './option.entity';
import { Vote } from './vote.entity';

@Entity()
export class Poll {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ default: false })
  multiple: boolean;  

  // Un sondage possède plusieurs options
  @OneToMany(type => Option, option => option.poll, { cascade: true })
  options: Option[];

  //Relation inverse : tous les votes reçus pour ce sondage
  @OneToMany(type => Vote, vote => vote.poll)
  votes: Vote[];
}