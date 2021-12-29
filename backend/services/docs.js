const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const pandadocSpecs = require("../specs/pandadoc.json");

const definition = {
    openapi: '3.0.0',
    info: {
      title: 'Ideas Center API',
      version: '0.1.0',
      license: {
        name: 'Licensed Under MIT',
        url: 'https://spdx.org/licenses/MIT.html',
      },
      contact: {
        name: 'Leonardo Coelho',
        url: 'https://www.linkedin.com/in/leo-coelho/',
      },
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Development server',
      },
      {
        url: 'https://salty-ravine-34635.herokuapp.com',
        description: 'Production server',
      }
    ]
};

const options = {
    definition,
    apis: ['./services/*.js'],
};

const openApiSpec = swaggerJSDoc(options);
module.exports = openApiSpec;

module.exports = function(app){
    app.get("/docs/pandadoc", (req, res) => res.send(pandadocSpecs));
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(openApiSpec));
    app.get("/", (req, res) => res.send(definition));
};

// Define the security scheme type (HTTP bearer) and Apply the security globally to all operations
/**
 * @swagger
 * components:
 *  securitySchemes:
 *      bearerAuth:
 *          type: http
 *          scheme: bearer
 *          bearerFormat: JWT
 * 
 * security:
 *  - bearerAuth: []  
 */