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

  @Post(':id/vote')
  async vote(
    @Param('id') pollId: number,
    @Body() voteDto: VoteDto,
  ) {
    voteDto.pollId = pollId;
    return this.sondagesService.vote(voteDto);
  }
}
