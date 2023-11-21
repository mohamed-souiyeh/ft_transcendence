import { Test, TestingModule } from '@nestjs/testing';
import { PurplerainController } from './purplerain.controller';

describe('PurplerainController', () => {
  let controller: PurplerainController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PurplerainController],
    }).compile();

    controller = module.get<PurplerainController>(PurplerainController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
