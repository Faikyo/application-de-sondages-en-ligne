import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Unique } from 'typeorm';
import { Poll } from './poll.entity';
import { Option } from './option.entity';

/**
 * Entité représentant un vote d'un utilisateur
 * La contrainte unique sur (poll, voter) empêche les votes multiples
 */
@Entity()
@Unique(['poll', 'voter'])  // Contrainte d'unicité pour éviter le double vote
export class Vote {
  /**
   * Identifiant unique du vote
   * Généré automatiquement par la base de données
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * Identifiant de l'utilisateur qui a voté
   * Utilisé pour la contrainte d'unicité
   * @example "Jean", "Marie", "user123"
   */
  @Column()
  voter: string;    

  /**
   * Référence au sondage concerné par le vote
   * Suppression en cascade si le sondage est supprimé
   */
  @ManyToOne(type => Poll, poll => poll.votes, { onDelete: 'CASCADE' })
  poll: Poll;

  /**
   * Référence à l'option choisie
   * Suppression en cascade si l'option est supprimée
   */
  @ManyToOne(type => Option, { onDelete: 'CASCADE' })
  option: Option;
}