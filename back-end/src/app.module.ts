import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SondagesModule } from './sondages/sondages.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',        
      password: 'password',
      database: 'sondagedb',
      entities: [],  
      synchronize: true,          
    }),
    SondagesModule,
    
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
