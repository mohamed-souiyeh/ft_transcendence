import { Test, TestingModule } from '@nestjs/testing';
import { PurplerainService } from './purplerain.service';

describe('PurplerainService', () => {
  let service: PurplerainService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PurplerainService],
    }).compile();

    service = module.get<PurplerainService>(PurplerainService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
