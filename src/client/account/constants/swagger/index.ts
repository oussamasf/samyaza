export const loginSchema = {
  type: 'object',
  properties: {
    username: {
      type: 'string',
      example: 'itadori',
    },
    password: {
      type: 'string',
      format: 'password',
      example: 'yojiyojinotsukuna',
    },
  },
  required: ['email', 'password'],
};

export const signupSchema = {
  type: 'object',
  properties: {
    username: {
      type: 'string',
      format: 'username',
      example: 'ousf',
    },
    email: {
      type: 'string',
      format: 'email',
      example: 'ousf@medea.com',
    },
    password: {
      type: 'string',
      format: 'password',
      example: 'mysecretpassword',
    },
  },
  required: ['email', 'password'],
};
