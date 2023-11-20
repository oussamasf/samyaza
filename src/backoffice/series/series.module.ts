import { Module } from '@nestjs/common';
import { SeriesService } from './series.service';
import { SeriesController } from './series.controller';
import { SeriesRepository } from './repositories/series.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Series, SeriesSchema } from './schemas/series.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Series.name, schema: SeriesSchema }]),
  ],
  controllers: [SeriesController],
  providers: [SeriesService, SeriesRepository],
  exports: [SeriesService],
})
export class SeriesModule {}
