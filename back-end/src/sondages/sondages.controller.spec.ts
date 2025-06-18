import { Test, TestingModule } from '@nestjs/testing';
import { SondagesController } from './sondages.controller';

describe('SondagesController', () => {
  let controller: SondagesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SondagesController],
    }).compile();

    controller = module.get<SondagesController>(SondagesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
