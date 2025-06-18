import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SondagesModule } from './sondages/sondages.module';
import { Poll } from './sondages/poll.entity';
import { Option } from './sondages/option.entity';
import { Vote } from './sondages/vote.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',        
      password: 'password',
      database: 'sondagedb',
      entities: [Poll, Option, Vote],  
      synchronize: true,          
    }),
    TypeOrmModule.forFeature([Poll, Option, Vote]),
    SondagesModule,
    
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
