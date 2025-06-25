import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { SondagesService } from './sondages.service';
import { CreatePollDto, VoteDto } from './sondages.dto';

@Controller('sondages')
export class SondagesController {
  constructor(private readonly sondagesService: SondagesService) {}

  @Post()
  async createPoll(@Body() dto: CreatePollDto) {
    return this.sondagesService.createPoll(dto);
  }

  @Get()
  async listPolls() {
    return this.sondagesService.findAll();
  }

  @Get(':id/resultats')
  async getResults(@Param('id') id: number) {
    return this.sondagesService.getResults(id);
  }

  @Get(':id/has-voted/:voter')
  async hasVoted(
    @Param('id') pollId: number,
    @Param('voter') voter: string,
  ) {
    return this.sondagesService.hasUserVoted(pollId, voter);
  }

  @Post(':id/vote')
  async vote(
    @Param('id') pollId: number,
    @Body() voteDto: VoteDto,
  ) {
    return this.sondagesService.vote(pollId, voteDto);
  }
}