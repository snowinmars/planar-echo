import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Planar-asclepius API',
      version: '0.0.1',
      contact: {
        name: '@snowinmars',
        email: 'snowinmars@yandex.ru'
      }
    },
    servers: [
      {
        url: 'http://localhost:3003',
        description: 'Development server'
      }
    ]
  },
  apis: [
    './src/controllers/router.ts',
  ],
};

export const swaggerSpec = swaggerJsdoc(options);
