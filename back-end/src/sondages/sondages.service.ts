import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Poll } from './poll.entity';
import { Option } from './option.entity';
import { Vote } from './vote.entity';
import { CreatePollDto, VoteDto } from './sondages.dto';

/**
 * Service gérant la logique métier des sondages
 * Gère la création, consultation et vote des sondages
 */
@Injectable()
export class SondagesService {
  constructor(
    @InjectRepository(Poll)
    private pollRepo: Repository<Poll>,
    @InjectRepository(Option)
    private optionRepo: Repository<Option>,
    @InjectRepository(Vote)
    private voteRepo: Repository<Vote>,
  ) {}

  /**
   * Crée un nouveau sondage avec ses options
   * @param dto - Données du sondage à créer
   * @returns Le sondage créé avec ses options
   * @example
   * createPoll({
   *   title: "Langage préféré ?",
   *   description: "Choisissez votre langage",
   *   multiple: false,
   *   options: ["JavaScript", "Python", "Java"]
   * })
   */
  async createPoll(dto: CreatePollDto): Promise<Poll> {
    const { title, description, multiple, options } = dto;
    
    // Créer l'entité sondage
    const poll = this.pollRepo.create({ title, description, multiple });
    
    // Créer les options associées
    poll.options = options.map(text => this.optionRepo.create({ text }));
    
    // Sauvegarder en cascade (sondage + options)
    return this.pollRepo.save(poll);
  }

  /**
   * Récupère tous les sondages avec leurs options
   * @returns Liste de tous les sondages
   */
  findAll(): Promise<Poll[]> {
    return this.pollRepo.find({ relations: ['options'] });
  }

  /**
   * Récupère les résultats détaillés d'un sondage
   * @param pollId - ID du sondage
   * @returns Résultats avec nombre de votes par option
   * @throws NotFoundException si le sondage n'existe pas
   */
  async getResults(pollId: number) {
    // Rechercher le sondage avec ses options
    const poll = await this.pollRepo.findOne({
      where: { id: pollId },
      relations: ['options']  
    });
    
    if (!poll) {
      throw new NotFoundException('Sondage introuvable');
    }
    
    // Calculer les votes pour chaque option
    const results: { optionId: number; text: string; votes: number }[] = [];
    let totalVotes = 0;
    
    for (const option of poll.options) {
      const count = await this.voteRepo.count({ 
        where: { option: { id: option.id } } 
      });
      results.push({
        optionId: option.id,
        text: option.text,
        votes: count
      });
      totalVotes += count;  
    }
    
    // Retourner les résultats formatés
    return {
      poll: {
        id: poll.id,
        title: poll.title,
        description: poll.description,
        multiple: poll.multiple
      },
      results,
      totalVotes 
    };
  }

  /**
   * Enregistre le vote d'un utilisateur
   * @param pollId - ID du sondage
   * @param voteDto - Données du vote (voter et options choisies)
   * @returns Message de confirmation
   * @throws NotFoundException si le sondage n'existe pas
   * @throws BadRequestException si :
   *   - L'utilisateur a déjà voté
   *   - Plusieurs options choisies pour un sondage simple
   *   - Options invalides
   */
  async vote(pollId: number, voteDto: VoteDto): Promise<{ message: string }> {
    const { voter, optionIds } = voteDto;
    
    // Récupérer le sondage pour vérifier la règle 'multiple'
    const poll = await this.pollRepo.findOne({ 
      where: { id: pollId },
      relations: ['options']
    });
    
    if (!poll) {
      throw new NotFoundException('Sondage introuvable');
    }
    
    // Vérifier si l'utilisateur a déjà voté
    const existing = await this.voteRepo.findOne({ 
      where: { poll: { id: pollId }, voter } 
    });
    
    if (existing) {
      throw new BadRequestException('Vous avez déjà voté pour ce sondage');
    }
    
    // Vérifier la contrainte multiple
    if (!poll.multiple && optionIds.length > 1) {
      throw new BadRequestException('Ce sondage n\'autorise qu\'une seule réponse');
    }
    
    // Vérifier que les options existent
    const validOptionIds = poll.options.map(opt => opt.id);
    const invalidOptions = optionIds.filter(id => !validOptionIds.includes(id));
    
    if (invalidOptions.length > 0) {
      throw new BadRequestException('Une ou plusieurs options sont invalides');
    }
    
    // Enregistrer les votes (un vote par option choisie)
    for (const optId of optionIds) {
      const vote = this.voteRepo.create({ 
        poll: { id: pollId } as Poll, 
        voter, 
        option: { id: optId } as Option 
      });
      await this.voteRepo.save(vote);
    }
    
    return { message: 'Vote enregistré avec succès' };
  }

  /**
   * Vérifie si un utilisateur a déjà voté pour un sondage
   * @param pollId - ID du sondage
   * @param voter - Identifiant de l'utilisateur
   * @returns Objet indiquant si l'utilisateur a voté
   */
  async hasUserVoted(pollId: number, voter: string): Promise<{ hasVoted: boolean }> {
    const vote = await this.voteRepo.findOne({ 
      where: { poll: { id: pollId }, voter } 
    });
    
    return { hasVoted: !!vote };
  }
}