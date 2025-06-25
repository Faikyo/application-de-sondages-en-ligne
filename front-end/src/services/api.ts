/** URL de base de l'API backend */
const API_URL = 'http://localhost:3000/api';

/**
 * Interface représentant un sondage complet
 */
export interface Poll {
  /** Identifiant unique du sondage */
  id: number;
  /** Titre du sondage */
  title: string;
  /** Description détaillée */
  description: string;
  /** Indique si plusieurs réponses sont autorisées */
  multiple: boolean;
  /** Liste des options de réponse */
  options: Option[];
}

/**
 * Interface représentant une option de réponse
 */
export interface Option {
  /** Identifiant unique de l'option */
  id: number;
  /** Texte de l'option */
  text: string;
}

/**
 * DTO pour créer un nouveau sondage
 */
export interface CreatePollDto {
  title: string;
  description: string;
  multiple: boolean;
  /** Tableau de textes pour les options */
  options: string[];
}

/**
 * DTO pour enregistrer un vote
 */
export interface VoteDto {
  /** Identifiant de l'utilisateur votant */
  voter: string;
  /** IDs des options sélectionnées */
  optionIds: number[];
}

/**
 * Interface pour les résultats d'un sondage
 */
export interface PollResults {
  /** Informations de base du sondage */
  poll: {
    id: number;
    title: string;
    description: string;
    multiple: boolean;
  };
  /** Résultats détaillés par option */
  results: {
    optionId: number;
    text: string;
    votes: number;
  }[];
  /** Nombre total de votes */
  totalVotes: number;
}

/**
 * Service singleton pour communiquer avec l'API backend
 * Gère tous les appels HTTP vers le serveur
 */
class ApiService {
  /**
   * Crée un nouveau sondage
   * @param data - Données du sondage à créer
   * @returns Le sondage créé avec ses IDs générés
   * @throws Error si la création échoue
   */
  async createPoll(data: CreatePollDto): Promise<Poll> {
    const response = await fetch(`${API_URL}/sondages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error('Erreur lors de la création du sondage');
    }
    
    return response.json();
  }

  /**
   * Récupère tous les sondages disponibles
   * @returns Liste de tous les sondages avec leurs options
   * @throws Error si la récupération échoue
   */
  async getAllPolls(): Promise<Poll[]> {
    const response = await fetch(`${API_URL}/sondages`);
    
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des sondages');
    }
    
    return response.json();
  }

  /**
   * Récupère les résultats détaillés d'un sondage
   * @param pollId - ID du sondage
   * @returns Résultats avec votes par option
   * @throws Error si la récupération échoue
   */
  async getPollResults(pollId: number): Promise<PollResults> {
    const response = await fetch(`${API_URL}/sondages/${pollId}/resultats`);
    
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des résultats');
    }
    
    return response.json();
  }

  /**
   * Enregistre le vote d'un utilisateur
   * @param pollId - ID du sondage
   * @param voteData - Données du vote (voter et options)
   * @returns Message de confirmation
   * @throws Error avec le message d'erreur du serveur
   */
  async vote(pollId: number, voteData: VoteDto): Promise<{ message: string }> {
    const response = await fetch(`${API_URL}/sondages/${pollId}/vote`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(voteData),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erreur lors du vote');
    }
    
    return response.json();
  }

  /**
   * Vérifie si un utilisateur a déjà voté pour un sondage
   * @param pollId - ID du sondage
   * @param voter - Identifiant de l'utilisateur
   * @returns Objet avec hasVoted: boolean
   * @throws Error si la vérification échoue
   */
  async hasUserVoted(pollId: number, voter: string): Promise<{ hasVoted: boolean }> {
    // Encoder le voter pour gérer les caractères spéciaux dans l'URL
    const response = await fetch(`${API_URL}/sondages/${pollId}/has-voted/${encodeURIComponent(voter)}`);
    
    if (!response.ok) {
      throw new Error('Erreur lors de la vérification du vote');
    }
    
    return response.json();
  }
}

// Export d'une instance unique (pattern Singleton)
export default new ApiService();