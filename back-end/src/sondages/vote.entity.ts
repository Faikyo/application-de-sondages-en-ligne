import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';


@Entity()
export class Vote {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  voter: string;  

}