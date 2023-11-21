import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { onModelEnum } from '../constants';

export type FavoriteDocument = HydratedDocument<Favorite>;

@Schema({
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
})
export class Favorite {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    required: true,
    refPath: 'onModel',
  })
  favoriteItem: Types.ObjectId;

  @Prop({ type: String, enum: onModelEnum, required: true })
  onModel: string;
}

export class ExtendedMovie extends Favorite {
  _id: string;
}

export const FavoriteSchema = SchemaFactory.createForClass(Favorite);
