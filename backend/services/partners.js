const { validateToken } = require("../utils/validateToken");
const authConfig = require("./../auth_config.json");
const fetch = require("node-fetch");

/**
 * @swagger
 * components:
 *   schemas:
 *     Partner:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *         first_name:
 *           type: string
 *         last_name:
 *           type: string
 *         company:
 *           type: string
 *         job_title:
 *           type: string
 */
 const parseResponse = (contact) => {
    const {email, first_name, last_name, company, job_title} = contact;
    return {email, first_name, last_name, company, job_title};
}

module.exports = function(app){
    /**
     * @swagger
     * /api/partners:
     *  get:
     *      security:
     *          - bearerAuth: []
     *      summary: Retrieve all Partners
     *      tags:
     *          - Partners
     *      responses:
     *          401:
     *              description: User is unauthorized. Access token is missing or invald.
     *          200:
     *              content:
     *                  application/json:
     *                      schema:
     *                          type: array
     *                          items: 
     *                              $ref: "#/components/schemas/Partner"
    */
    app.get("/api/partners", validateToken, (req, res) => {
        fetch(`https://api.pandadoc.com/public/v1/contacts/`, {
            headers: {
            'Authorization': authConfig.pandadocKey,
            'Content-Type': 'application/json'
            }
        })
        .then(res => res.json())
        .then(contacts => {
            const partners = contacts['results'].map( contact => {
                return parseResponse(contact);
            })
            res.send(partners)
        });
    });
    
    /**
     * @swagger
     * /api/partners:
     *  post:
     *      security:
     *          - bearerAuth: []
     *      summary: Create a Partner
     *      tags:
     *          - Partners
     *      requestBody:
     *          content:
     *              application/json:
     *                  schema:
     *                      $ref: "#/components/schemas/Partner"
     *              
     *      responses:
     *          401:
     *              description: User is unauthorized. Access token is missing or invald. 
     *          200:
     *              description: The created Partner
     *              content:
     *                  application/json:
     *                      schema:
     *                          $ref: "#/components/schemas/Partner"
    */
    app.post("/api/partners", validateToken,  (req, res) => {
        fetch(`https://api.pandadoc.com/public/v1/contacts/`, {
            method: 'POST',
            headers: {
                'Authorization': authConfig.pandadocKey,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(req.body)
        })
        .then(res => res.json())
        .then(contact => res.send( parseResponse(contact) ));
    });
}