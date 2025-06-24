import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Poll } from './poll.entity';
import { Option } from './option.entity';
import { Vote } from './vote.entity';
import { CreatePollDto, VoteDto } from './sondages.dto';

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

  async createPoll(dto: CreatePollDto): Promise<Poll> {
    const { title, description, multiple, options } = dto;
    const poll = this.pollRepo.create({ title, description, multiple });
    poll.options = options.map(text => this.optionRepo.create({ text }));
    return this.pollRepo.save(poll);
  }

  findAll(): Promise<Poll[]> {
    return this.pollRepo.find({ relations: ['options'] });
  }

  async getResults(pollId: number) {
    const poll = await this.pollRepo.findOne({
      where: { id: pollId },
      relations: ['options']  
    });
    
    if (!poll) {
      throw new NotFoundException('Sondage introuvable');
    }
    
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
    
    // Enregistrer les votes
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
}