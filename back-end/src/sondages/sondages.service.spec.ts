import { Test, TestingModule } from '@nestjs/testing';
import { SondagesService } from './sondages.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Poll } from './poll.entity';
import { Option } from './option.entity';
import { Vote } from './vote.entity';

describe('SondagesService', () => {
  let service: SondagesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SondagesService,

        {
          provide: getRepositoryToken(Poll),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
          },
        },

        {
          provide: getRepositoryToken(Option),
          useValue: {
            create: jest.fn(),
            find: jest.fn(),
          },
        },

        {
          provide: getRepositoryToken(Vote),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            count: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<SondagesService>(SondagesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});