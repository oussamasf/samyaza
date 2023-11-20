import { Test, TestingModule } from '@nestjs/testing';
import { TripController } from './movie.controller';
import { TripService } from './movie.service';

describe('TripController', () => {
  let controller: TripController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TripController],
      providers: [TripService],
    }).compile();

    controller = module.get<TripController>(TripController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
