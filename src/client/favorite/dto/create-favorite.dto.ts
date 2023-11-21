import { Types } from 'mongoose';

export class CreateFavoriteDto {
  favoriteItem: Types.ObjectId;
  onModel: 'Movie' | 'Series';
  userId: Types.ObjectId;
}
