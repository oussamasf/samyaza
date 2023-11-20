import { Test, TestingModule } from '@nestjs/testing';
import { ClientAuthController } from './client.auth.controller';
import { ClientAuthService } from './client.auth.service';

describe('ClientAuthController', () => {
  let controller: ClientAuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClientAuthController],
      providers: [ClientAuthService],
    }).compile();

    controller = module.get<ClientAuthController>(ClientAuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
