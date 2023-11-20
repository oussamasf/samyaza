import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as bcrypt from 'bcrypt';

export type ClientDocument = HydratedDocument<Client>;

@Schema({
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
})
export class Client {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop()
  phoneNumber: string;

  @Prop()
  password: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  refreshToken?: string;
}

export const ClientSchema = SchemaFactory.createForClass(Client);

ClientSchema.pre('save', async function (next) {
  const { CRYPTO_SALT_ROUNDS } = process.env;
  const agent = this as Client;

  try {
    const hashedPassword = await bcrypt.hash(
      agent.password,
      parseInt(`${CRYPTO_SALT_ROUNDS}`),
    );
    agent.password = hashedPassword;
    next();
  } catch (error) {
    return next(error);
  }
});
