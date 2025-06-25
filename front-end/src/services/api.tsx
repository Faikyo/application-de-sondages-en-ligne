const API_URL = 'http://localhost:3000/api';

export interface Poll {
  id: number;
  title: string;
  description: string;
  multiple: boolean;
  options: Option[];
}

export interface Option {
  id: number;
  text: string;
}

export interface CreatePollDto {
  title: string;
  description: string;
  multiple: boolean;
  options: string[];
}

export interface VoteDto {
  voter: string;
  optionIds: number[];
}

export interface PollResults {
  poll: {
    id: number;
    title: string;
    description: string;
    multiple: boolean;
  };
  results: {
    optionId: number;
    text: string;
    votes: number;
  }[];
  totalVotes: number;
}

class ApiService {
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

  async getAllPolls(): Promise<Poll[]> {
    const response = await fetch(`${API_URL}/sondages`);
    
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des sondages');
    }
    
    return response.json();
  }

  async getPollResults(pollId: number): Promise<PollResults> {
    const response = await fetch(`${API_URL}/sondages/${pollId}/resultats`);
    
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des résultats');
    }
    
    return response.json();
  }

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

  async hasUserVoted(pollId: number, voter: string): Promise<{ hasVoted: boolean }> {
    const response = await fetch(`${API_URL}/sondages/${pollId}/has-voted/${encodeURIComponent(voter)}`);
    
    if (!response.ok) {
      throw new Error('Erreur lors de la vérification du vote');
    }
    
    return response.json();
  }
}

export default new ApiService();