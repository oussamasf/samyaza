import { Test, TestingModule } from '@nestjs/testing';
import { TripService } from './movie.service';

describe('TripService', () => {
  let service: TripService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TripService],
    }).compile();

    service = module.get<TripService>(TripService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
