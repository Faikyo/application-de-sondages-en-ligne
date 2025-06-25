import { IsString, IsBoolean, ArrayMinSize, IsArray, IsNumber } from 'class-validator';

/**
 * DTO pour la création d'un nouveau sondage
 * Utilisé pour valider les données entrantes lors de la création
 */
export class CreatePollDto {
  /**
   * Titre du sondage
   * @example "Quel est votre framework préféré ?"
   */
  @IsString()
  title: string;

  /**
   * Description détaillée du sondage
   * @example "Choisissez parmi les frameworks JavaScript suivants"
   */
  @IsString()
  description: string;

  /**
   * Indique si plusieurs réponses sont autorisées
   * true = choix multiples, false = choix unique
   */
  @IsBoolean()
  multiple: boolean;

  /**
   * Liste des options de réponse
   * Doit contenir au minimum 2 options
   * @example ["React", "Angular", "Vue.js"]
   */
  @IsArray()
  @ArrayMinSize(2)
  @IsString({ each: true })
  options: string[]; 
}

/**
 * DTO pour l'enregistrement d'un vote
 * Utilisé pour valider les données lors du vote
 */
export class VoteDto {
  /**
   * Identifiant de l'utilisateur qui vote
   * Utilisé pour empêcher les votes multiples
   * @example "Jean123"
   */
  @IsString()
  voter: string;

  /**
   * Liste des IDs d'options sélectionnées
   * Un seul ID pour les sondages à choix unique
   * Plusieurs IDs possibles pour les sondages à choix multiples
   * @example [1] ou [1, 3, 5]
   */
  @IsArray()
  @IsNumber({}, { each: true })
  optionIds: number[];  
}