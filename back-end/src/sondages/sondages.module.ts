import { Module } from '@nestjs/common';
import { SondagesController } from './sondages.controller';
import { SondagesService } from './sondages.service';

@Module({
  controllers: [SondagesController],
  providers: [SondagesService]
})
export class SondagesModule {}
