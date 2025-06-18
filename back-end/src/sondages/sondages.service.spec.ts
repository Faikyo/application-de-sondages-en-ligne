import { Test, TestingModule } from '@nestjs/testing';
import { SondagesService } from './sondages.service';

describe('SondagesService', () => {
  let service: SondagesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SondagesService],
    }).compile();

    service = module.get<SondagesService>(SondagesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
