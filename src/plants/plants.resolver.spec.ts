import { Test, TestingModule } from '@nestjs/testing';
import { PlantsResolver } from './plants.resolver';
import { PlantsService } from './plants.service';

describe('PlantsResolver', () => {
  let resolver: PlantsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlantsResolver, PlantsService],
    }).compile();

    resolver = module.get<PlantsResolver>(PlantsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
