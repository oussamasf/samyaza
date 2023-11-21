export const updateSeriesRequestBody = {
  type: 'object',
  properties: {
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
    idNumber: {
      type: 'number',
      example: 1,
    },
    originCountry: {
      type: 'array',
      items: {
        type: 'string',
        example: ['US', 'UK'],
      },
    },
    originalLanguage: {
      type: 'string',
      example: 'en',
    },
    originalName: {
      type: 'string',
      example: 'Original Name',
    },
    overview: {
      type: 'string',
      example: 'This is a series overview.',
    },
    popularity: {
      type: 'number',
      example: 8.5,
    },
    firstAirDate: {
      type: 'string',
      example: '2023-11-21',
    },
    name: {
      type: 'string',
      example: 'Series Name',
    },
    voteAverage: {
      type: 'number',
      example: 9.0,
    },
    voteCount: {
      type: 'number',
      example: 1500,
    },
  },
  required: [],
};
