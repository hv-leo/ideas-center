const { validateToken } = require("../utils/validateToken");
const authConfig = require("./../auth_config.json");
const fetch = require("node-fetch");

/**
 * @swagger
 * components:
 *   schemas:
 *     Agreement:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 */
const parseResponse = (document) => {
    const {id, name} = document;
    return { id, name };
}

module.exports = function(app){
    /**
     * @swagger
     * /api/agreements:
     *  get:
     *      security:
     *          - bearerAuth: []
     *      summary: Retrieve all Agreements
     *      tags:
     *          - Agreements
     *      responses:
     *          401:
     *              description: User is unauthorized. Access token is missing or invald.
     *          200:
     *              content:
     *                  application/json:
     *                      schema:
     *                          type: array
     *                          items: 
     *                              $ref: "#/components/schemas/Agreement"
    */
    app.get("/api/agreements", validateToken, (req, res) => {
        fetch(`https://api.pandadoc.com/public/v1/documents/`, {
            headers: {
            'Authorization': authConfig.pandadocKey,
            'Content-Type': 'application/json'
            }
        })
        .then(res => res.json())
        .then( documents => {
            const agreements = documents['results']
                .filter( document => document.status === 'document.completed' )
                .map(document => {
                    return parseResponse(document);
                });
            res.send(agreements);
        });
    });
    
    /**
     * @swagger
     * /api/agreements:
     *  post:
     *      security:
     *          - bearerAuth: []
     *      summary: Make an Agreement
     *      tags:
     *          - Agreements
     *      requestBody:
     *          content:
     *              application/json:
     *                  schema:
     *                      type: object
     *                      properties:
     *                          document:
     *                              $ref: "https://salty-ravine-34635.herokuapp.com/docs/pandadoc#/components/schemas/DocumentCreateRequest"
     *                          message:
     *                              $ref: "https://salty-ravine-34635.herokuapp.com/docs/pandadoc#/components/schemas/DocumentSendRequest"
     *      responses:
     *          401:
     *              description: User is unauthorized. Access token is missing or invald.
     *          200:
     *              description: The pending Agreement
     *              content:
     *                  application/json:
     *                      schema:
     *                          $ref: "#/components/schemas/Agreement"
    */
    app.post("/api/agreements", validateToken, (req, res) => {
        // Create Document
        fetch(`https://api.pandadoc.com/public/v1/documents/`, {
            method: 'POST',
            headers: {
                'Authorization': authConfig.pandadocKey,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(req.body.document)
        })
        .then(res => res.json())
        .then(jsonData => {
            // Send Document.
            const documentId = jsonData.id
            setTimeout(function(){
                fetch(`https://api.pandadoc.com/public/v1/documents/${documentId}/send`, {
                    method: 'POST',
                    headers: {
                        'Authorization': authConfig.pandadocKey,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(req.body.message)
                })
                .then(res => res.json())
                .then( document => {
                    res.send( parseResponse(document) );
                });
            }, 1000);
        })
    });
}
