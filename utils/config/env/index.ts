import * as Joi from 'joi';

const envFilePath =
  process.env.NODE_ENV === 'production' ? ['.env'] : ['.env.development'];
const configOptions = {
  // validate .env file using joi
  validationSchema: Joi.object({
    PORT: Joi.number().default(3000),
    MONGO_PORT: Joi.number().required(),
    MONGO_DATA: Joi.string().required(),
    MONGO_DUMP: Joi.string().required(),
  }),
  validationOptions: {
    allowUnknown: true,
    abortEarly: true,
  },
  envFilePath,
  isGlobal: true,
};

export { configOptions };
