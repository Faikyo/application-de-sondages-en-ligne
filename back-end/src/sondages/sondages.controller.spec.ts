import { Test, TestingModule } from '@nestjs/testing';
import { SondagesController } from './sondages.controller';
import { SondagesService } from './sondages.service';

describe('SondagesController', () => {
  let controller: SondagesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SondagesController],
      providers: [
        {
          provide: SondagesService,
          useValue: {

            createPoll: jest.fn(),
            findAll: jest.fn(),
            getResults: jest.fn(),
            vote: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<SondagesController>(SondagesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
