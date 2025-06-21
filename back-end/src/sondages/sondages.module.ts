import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SondagesService } from './sondages.service';
import { SondagesController } from './sondages.controller';
import { Poll } from './poll.entity';
import { Option } from './option.entity';
import { Vote } from './vote.entity';

@Module({
   imports: [
    TypeOrmModule.forFeature([Poll, Option, Vote]), 
  ],
  controllers: [SondagesController],
  providers: [SondagesService]
})
export class SondagesModule {}
