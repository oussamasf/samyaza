export const updateGenreRequestBody = {
  type: 'object',
  properties: {
    idNumber: {
      type: 'number',
      example: 1,
    },
    title: {
      type: 'string',
      example: 'The Movie Title',
    },
    adult: {
      type: 'boolean',
      example: true,
    },
    genreIds: {
      type: 'array',
      items: {
        type: 'number',
        example: [1, 2, 3],
      },
    },
    originalLanguage: {
      type: 'string',
      example: 'en',
    },
    originalTitle: {
      type: 'string',
      example: 'Original Title',
    },
    overview: {
      type: 'string',
      example: 'This is a movie overview.',
    },
    popularity: {
      type: 'number',
      example: 7.5,
    },
    releaseDate: {
      type: 'string',
      example: '2023-11-21',
    },
    video: {
      type: 'boolean',
      example: true,
    },
    voteAverage: {
      type: 'number',
      example: 8.2,
    },
    voteCount: {
      type: 'number',
      example: 1000,
    },
  },
  required: [],
};
