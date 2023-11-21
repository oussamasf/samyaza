import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type MovieDocument = HydratedDocument<Movie>;

@Schema({
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
})
export class Movie {
  @Prop({ required: true, unique: true })
  idNumber: number;

  @Prop({ required: true, unique: true })
  title: string;

  @Prop({ default: false })
  adult: boolean;

  @Prop([Number])
  genreIds: number[];

  @Prop()
  originalLanguage: string;

  @Prop()
  originalTitle: string;

  @Prop()
  overview: string;

  @Prop()
  popularity: number;

  @Prop()
  releaseDate: string;

  @Prop()
  video: boolean;

  @Prop()
  voteAverage: number;

  @Prop()
  voteCount: number;
}

export class ExtendedMovie extends Movie {
  _id: string;
}

export const MovieSchema = SchemaFactory.createForClass(Movie);
MovieSchema.index({ title: 1 }, { unique: true });
