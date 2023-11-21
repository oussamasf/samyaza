export const loginSchema = {
  type: 'object',
  properties: {
    email: {
      type: 'string',
      format: 'email',
      example: 'user@example.com',
    },
    password: {
      type: 'string',
      format: 'password',
      example: 'mysecretpassword',
    },
  },
  required: ['email', 'password'],
};

export const addAdmin = {
  type: 'object',
  properties: {
    email: {
      type: 'string',
      format: 'email',
      example: 'user@example.com',
    },
    password: {
      type: 'string',
      format: 'password',
      example: 'mysecretpassword',
    },
    username: {
      type: 'string',
      example: 'someone',
    },
  },
  required: ['email', 'password', 'username'],
};
