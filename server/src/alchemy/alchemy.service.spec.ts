import { Test, TestingModule } from '@nestjs/testing';
import { AlchemyService } from './alchemy.service';

describe('AlchemyService', () => {
  let service: AlchemyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AlchemyService],
    }).compile();

    service = module.get<AlchemyService>(AlchemyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
