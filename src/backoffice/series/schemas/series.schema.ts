import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SeriesDocument = HydratedDocument<Series>;

@Schema({
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
})
export class Series {
  @Prop({ required: true })
  adult: boolean;

  @Prop([Number])
  genreIds: number[];

  @Prop({ required: true, unique: true })
  idNumber: number;

  @Prop([String])
  originCountry: string[];

  @Prop({ required: true })
  originalLanguage: string;

  @Prop({ required: true })
  originalName: string;

  @Prop({ required: true })
  overview: string;

  @Prop({ required: true })
  popularity: number;

  @Prop({ required: true })
  firstAirDate: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  voteAverage: number;

  @Prop({ required: true })
  voteCount: number;
}

export class ExtendedSeries extends Series {
  _id: string;
}

export const SeriesSchema = SchemaFactory.createForClass(Series);
