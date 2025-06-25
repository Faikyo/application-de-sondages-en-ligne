import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { SondagesService } from './sondages.service';
import { CreatePollDto, VoteDto } from './sondages.dto';

/**
 * Contrôleur REST pour la gestion des sondages
 * Expose les endpoints de l'API sous /api/sondages
 */
@Controller('sondages')
export class SondagesController {
  constructor(private readonly sondagesService: SondagesService) {}

  /**
   * Crée un nouveau sondage
   * @route POST /api/sondages
   * @param dto - Données du sondage à créer
   * @returns Le sondage créé avec ses options et IDs générés
   */
  @Post()
  async createPoll(@Body() dto: CreatePollDto) {
    return this.sondagesService.createPoll(dto);
  }

  /**
   * Liste tous les sondages disponibles
   * @route GET /api/sondages
   * @returns Tableau de tous les sondages avec leurs options
   */
  @Get()
  async listPolls() {
    return this.sondagesService.findAll();
  }

  /**
   * Récupère les résultats d'un sondage spécifique
   * @route GET /api/sondages/:id/resultats
   * @param id - Identifiant du sondage
   * @returns Résultats détaillés avec nombre de votes par option
   */
  @Get(':id/resultats')
  async getResults(@Param('id') id: number) {
    return this.sondagesService.getResults(id);
  }

  /**
   * Vérifie si un utilisateur a déjà voté
   * @route GET /api/sondages/:id/has-voted/:voter
   * @param pollId - Identifiant du sondage
   * @param voter - Identifiant de l'utilisateur
   * @returns {hasVoted: boolean}
   */
  @Get(':id/has-voted/:voter')
  async hasVoted(
    @Param('id') pollId: number,
    @Param('voter') voter: string,
  ) {
    return this.sondagesService.hasUserVoted(pollId, voter);
  }

  /**
   * Enregistre le vote d'un utilisateur
   * @route POST /api/sondages/:id/vote
   * @param pollId - Identifiant du sondage
   * @param voteDto - Données du vote (voter et options choisies)
   * @returns Message de confirmation
   * @throws 400 si l'utilisateur a déjà voté ou données invalides
   * @throws 404 si le sondage n'existe pas
   */
  @Post(':id/vote')
  async vote(
    @Param('id') pollId: number,
    @Body() voteDto: VoteDto,
  ) {
    return this.sondagesService.vote(pollId, voteDto);
  }
}