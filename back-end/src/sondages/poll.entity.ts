import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Option } from './option.entity';
import { Vote } from './vote.entity';

/**
 * Entité représentant un sondage
 * Un sondage contient plusieurs options et peut recevoir plusieurs votes
 */
@Entity()
export class Poll {
  /**
   * Identifiant unique du sondage
   * Généré automatiquement par la base de données
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * Titre du sondage
   * @example "Quel est votre langage préféré ?"
   */
  @Column()
  title: string;

  /**
   * Description détaillée du sondage
   * @example "Choisissez parmi les langages de programmation suivants"
   */
  @Column()
  description: string;

  /**
   * Indique si le sondage accepte plusieurs réponses
   * @default false
   */
  @Column({ default: false })
  multiple: boolean;  

  /**
   * Liste des options de réponse pour ce sondage
   * Relation OneToMany avec cascade pour créer les options automatiquement
   */
  @OneToMany(type => Option, option => option.poll, { cascade: true })
  options: Option[];

  /**
   * Liste de tous les votes reçus pour ce sondage
   * Utilisé pour vérifier si un utilisateur a déjà voté
   */
  @OneToMany(type => Vote, vote => vote.poll)
  votes: Vote[];
}