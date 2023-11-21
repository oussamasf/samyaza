export const createGenreRequestBody = {
  type: 'object',
  properties: {
    idNumber: {
      type: 'number',
      example: 1,
    },
    name: {
      type: 'string',
      example: 'Action',
    },
  },
  required: ['idNumber', 'name'],
};

export const updateGenreRequestBody = {
  type: 'object',
  properties: {
    idNumber: {
      type: 'number',
      example: 1,
    },
    name: {
      type: 'string',
      example: 'Action',
    },
  },
  required: [],
};
