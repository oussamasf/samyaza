import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type GenreDocument = HydratedDocument<Genre>;

@Schema({
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
})
export class Genre {
  @Prop({ required: true, unique: true })
  idNumber!: number;

  @Prop({ required: true, unique: true })
  name!: string;
}

export class ExtendedGenre extends Genre {
  _id: string;
}

export const GenreSchema = SchemaFactory.createForClass(Genre);
