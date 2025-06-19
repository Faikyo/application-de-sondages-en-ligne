import { Controller, Get, Post, Param, Body, ParseIntPipe } from '@nestjs/common';
import { SondagesService } from './sondages.service';

@Controller('sondages')
export class SondagesController {
  constructor(private readonly sondagesService: SondagesService) {}

  @Post()
  async createPoll(@Body() body: {
    title: string;
    description?: string;
    multiple: boolean;
    options: string[];
  }) {
    return this.sondagesService.createPoll(body);
  }

  @Get()
  async listPolls() {
    return this.sondagesService.findAll();
  }

  @Get(':id/resultats')
  async getResults(@Param('id', ParseIntPipe) id: number) {
    return this.sondagesService.getResults(id);
  }

  @Post(':id/vote')
  async vote(
    @Param('id', ParseIntPipe) pollId: number,
    @Body() body: {
      voter: string;
      optionIds: number[];
    },
  ) {
    const voteData = {
      pollId,
      voter: body.voter,
      optionIds: body.optionIds,
    };
    return this.sondagesService.vote(voteData);
  }
}
