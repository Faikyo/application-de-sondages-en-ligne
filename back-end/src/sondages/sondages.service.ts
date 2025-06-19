import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Poll } from './poll.entity';
import { Option } from './option.entity';
import { Vote } from './vote.entity';

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

  async createPoll(data: {
    title: string;
    description?: string;
    multiple: boolean;
    options: string[]; 
  }): Promise<Poll> {
    const { title, description, multiple, options } = data;
    const poll = this.pollRepo.create({ title, description, multiple });
    poll.options = options.map(text => this.optionRepo.create({ text }));
    return this.pollRepo.save(poll);
  }

  findAll(): Promise<Poll[]> {
    return this.pollRepo.find({ relations: ['options'] });
  }

  async getResults(pollId: number) {
    const options = await this.optionRepo.find({ where: { poll: { id: pollId } } });
    const counts = {};
    for (const opt of options) {
      counts[opt.text] = await this.voteRepo.count({ where: { option: opt } });
    }
    return counts;
  }

  async vote(data: {
    pollId: number;
    voter: string;
    optionIds: number[];
  }): Promise<string> {
    const { pollId, voter, optionIds } = data;

    const existing = await this.voteRepo.findOne({
      where: { poll: { id: pollId }, voter },
    });

    if (existing) {
      throw new Error('Vous avez déjà voté pour ce sondage');
    }

    for (const optId of optionIds) {
      const vote = this.voteRepo.create({
        poll: { id: pollId } as Poll,
        voter,
        option: { id: optId } as Option,
      });
      await this.voteRepo.save(vote);
    }

    return 'Vote enregistré';
  }
}
