import { Test, TestingModule } from '@nestjs/testing';
import { ClientAuthService } from './client.auth.service';

describe('ClientAuthService', () => {
  let service: ClientAuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClientAuthService],
    }).compile();

    service = module.get<ClientAuthService>(ClientAuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
