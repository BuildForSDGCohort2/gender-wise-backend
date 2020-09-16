export default {
  swagger: '2.0',
  info: {
    version: '1.0.0',
    title: 'Genderwise',
    description:
      'An app that makes gender wise suggestion/corrections for gender sensitive words, promoting gender equality in the process'
  },
  basePath: '/api/v1/',
  schemes: ['https', 'http'],
  securityDefinitions: {
    Bearer: {
      type: 'apiKey',
      name: 'Authorization',
      in: 'header'
    }
  },
  servers: [
    {
      url: 'http://localhost:4000/api/v1'
    },
    {
      url: ''
    }
  ],
  consumes: ['application/json'],
  produces: ['application/json'],
  tags: [
    {
      name: 'API Endpoints',
      description: 'Endpoints for MVP'
    }
  ],
  paths: {
    '/words': {
      get: {
        tags: ['API Endpoints'],
        description:
          'Get all words that have been approved by way of mass polling',
        operationId: 'GetWords',
        parameters: [],
        responses: {
          200: {
            description:
              'Operation is successful and array of at most 100 approved words is returned with current page number and total count',
            schema: {
              type: 'object',
              example: {
                status: 200,
                message: 'words',
                data: {
                  page: 1,
                  results: [
                    {
                      status: 'approved',
                      twitterPostId: '12345678910',
                      upvotes: 0,
                      downvotes: 0,
                      _id: '5f614224f28bc727dc4e8e64',
                      word: 'mankind',
                      genderwise: 'humanity',
                      createdAt: '2020-09-15T22:37:24.474Z',
                      updatedAt: '2020-09-15T22:37:24.474Z',
                      __v: 0
                    },
                    '... 99 other results ...'
                  ],
                  resultCount: 100,
                  totalCount: 10000
                }
              }
            }
          }
        }
      },
      post: {
        tags: ['API Endpoints'],
        description:
          'Suggest a new word and it will be put out for polling and accepted or rejected based on results from said poll.',
        operationId: 'SuggestWord',
        security: [],
        parameters: [
          {
            in: 'body',
            name: 'request body',
            description: 'word and genderwise replacement',
            required: true,
            schema: {
              type: 'object',
              example: {
                word: 'mankind',
                genderwise: 'humanity'
              }
            }
          }
        ],
        responses: {
          200: {
            description: 'Request was successful',
            schema: {
              type: 'object',
              example: {
                status: 200,
                message: 'new word',
                data: {
                  status: 'pending',
                  twitterPostId: null,
                  upvotes: 0,
                  downvotes: 0,
                  _id: '5f614224f28bc727dc4e8e64',
                  word: 'mankind',
                  genderwise: 'humanity',
                  createdAt: '2020-09-15T22:37:24.474Z',
                  updatedAt: '2020-09-15T22:37:24.474Z',
                  __v: 0
                }
              }
            }
          },
          400: {
            description: 'The suggested word already exists',
            schema: {
              type: 'object',
              example: {
                status: 400,
                message:
                  'There is already a gender wise replacement for mankind thank you.',
                error: 'Not Found Error'
              }
            }
          },
          422: {
            description:
              'Either missing a required field or an invalid value in one of the fields',
            schema: {
              type: 'object',
              example: {
                status: 422,
                message: '"word" is required',
                error: 'Validation Error'
              }
            }
          }
        }
      }
    },
    '/words/{wordId}': {
      get: {
        tags: ['API Endpoints'],
        description: 'Gets a single word with its ID',
        operationId: 'GetSingleWord',
        parameters: [
          {
            in: 'path',
            name: 'wordId',
            required: true,
            description: "The word's ID",
            schema: {
              type: 'string',
              example: '5f614224f28bc727dc4e8e64'
            }
          }
        ],
        responses: {
          200: {
            description: 'Operation completed successfully and word was found',
            schema: {
              type: 'object',
              example: {
                status: 200,
                message: 'word',
                data: {
                  status: 'approved',
                  twitterPostId: '',
                  upvotes: 0,
                  downvotes: 0,
                  _id: '5f614224f28bc727dc4e8e64',
                  word: 'mankind',
                  genderwise: 'humanity',
                  createdAt: '2020-09-15T22:37:24.474Z',
                  updatedAt: '2020-09-15T22:38:11.427Z',
                  __v: 0
                }
              }
            }
          },
          404: {
            description:
              "The resource you're looking for either does not exist or has been moved",
            schema: {
              type: 'object',
              example: {
                status: 404,
                message: 'no result matches your search',
                error: 'Not Found'
              }
            }
          }
        }
      },
      put: {
        tags: ['API Endpoints'],
        description:
          'Endpoint to vote either for or against a word suggested by yourself or other users',
        operationId: 'VoteWord',
        parameters: [
          {
            in: 'path',
            name: 'wordId',
            required: true,
            description: "The word's ID",
            schema: {
              type: 'string',
              example: '5f614224f28bc727dc4e8e64'
            }
          },
          {
            in: 'body',
            required: true,
            description: 'users vote',
            schema: {
              type: 'object',
              example: {
                vote: true
              }
            }
          }
        ],
        responses: {
          200: {
            description: 'Voted successfully',
            schema: {
              type: 'object',
              example: {
                status: 200,
                message: 'successfully voted',
                data: {
                  status: 'pending',
                  twitterPostId: '1306040358409732098',
                  upvotes: 1,
                  downvotes: 0,
                  _id: '5f614224f28bc727dc4e8e64',
                  word: 'mankind',
                  genderwise: 'humanity',
                  createdAt: '2020-09-15T22:37:24.474Z',
                  updatedAt: '2020-09-16T01:32:18.086Z',
                  __v: 0
                }
              }
            }
          },
          422: {
            description:
              'Either missing a required field or an invalid value in one of the fields',
            schema: {
              type: 'object',
              example: {
                status: 422,
                message: '"vote" is required',
                error: 'Validation Error'
              }
            }
          }
        }
      }
    },
    '/words/word/{word}': {
      get: {
        tags: ['API Endpoints'],
        description:
          'Search by word. For cases when you match with the regex and get an array of matching words, you can use this endpoint to get the words by, well, the word, lol.',
        operationId: 'SearchByWord',
        parameters: [
          {
            in: 'path',
            name: 'word',
            description: "the word you're searching for",
            schema: {
              type: 'string',
              example: 'mankind'
            }
          }
        ],
        responses: {
          200: {
            description: 'Search was successful and a word was found, hurray!',
            schema: {
              type: 'object',
              example: {
                status: 200,
                message: 'word',
                data: {
                  status: 'pending',
                  twitterPostId: '1306040358409732098',
                  upvotes: 1,
                  downvotes: 0,
                  _id: '5f614224f28bc727dc4e8e64',
                  word: 'mankind',
                  genderwise: 'humanity',
                  createdAt: '2020-09-15T22:37:24.474Z',
                  updatedAt: '2020-09-16T01:32:18.086Z',
                  __v: 0
                }
              }
            }
          },
          404: {
            description:
              "The resource you're looking for either does not exist or has been moved",
            schema: {
              type: 'object',
              example: {
                status: 404,
                message: 'no result matches your search',
                error: 'Not Found'
              }
            }
          }
        }
      }
    },
    '/polls': {
      get: {
        tags: ['API Endpoints'],
        description: 'Gets a list of words up for polling by the public',
        operationId: 'GetPollables',
        parameters: [],
        responses: {
          200: {
            description:
              'Request was succesful and an array of pollable words is returned',
            shema: {
              type: 'object',
              example: {
                status: 200,
                message: 'words',
                data: {
                  page: 1,
                  results: [
                    {
                      status: 'pending',
                      twitterPostId: '1306040358409732098',
                      upvotes: 1,
                      downvotes: 0,
                      _id: '5f614224f28bc727dc4e8e64',
                      word: 'mankind',
                      genderwise: 'humanity',
                      createdAt: '2020-09-15T22:37:24.474Z',
                      updatedAt: '2020-09-16T01:32:18.086Z',
                      __v: 0
                    },
                    '... 99 more results ...'
                  ],
                  resultCount: 100,
                  totalCount: 10000
                }
              }
            }
          }
        }
      }
    },
    '/regex': {
      get: {
        tags: ['API Endpoints'],
        description:
          "Returns a regexable string. Regexable in the sense that you can stick it in a Regex constructor with the 'gi' flag and you have a regex that will seek out all gender sensitive words or statements in the string you match it against, like a heat seeking missile",
        operationId: 'GetMeSomeRegexBaby',
        parameter: [],
        responses: {
          200: {
            description:
              "Operation was successful and you have you a great regexable string, you're welcome.",
            schema: {
              type: 'object',
              example: {
                status: 200,
                message: 'string',
                data: '(\bmankind\b)'
              }
            }
          }
        }
      }
    }
  }
};
