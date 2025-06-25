import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Poll } from './poll.entity';

/**
 * Entité représentant une option de réponse dans un sondage
 */
@Entity()
export class Option {
  /**
   * Identifiant unique de l'option
   * Généré automatiquement par la base de données
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * Texte de l'option de réponse
   * @example "JavaScript", "Python", "Java"
   */
  @Column()
  text: string;

  /**
   * Référence au sondage parent
   * Relation ManyToOne avec suppression en cascade
   */
  @ManyToOne(type => Poll, poll => poll.options, { onDelete: 'CASCADE' })
  poll: Poll;
}