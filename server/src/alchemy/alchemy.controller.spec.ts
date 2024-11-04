import { Test, TestingModule } from '@nestjs/testing';
import { AlchemyController } from './alchemy.controller';

describe('AlchemyController', () => {
  let controller: AlchemyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AlchemyController],
    }).compile();

    controller = module.get<AlchemyController>(AlchemyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
