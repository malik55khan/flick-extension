var express = require('express');
var router = express.Router();
var db = require('./user.ctrl');
var jwt = require('../../config/jwToken');

/**
 * @swagger
 * definitions:
 *   Register:
 *     properties:
 *       name:
 *         type: string
 *       email:
 *         type: string
 *       password:
 *          type: string
 *       role:
 *          type: string    
 *       country:
 *          type: string
 *       vatNumber:
 *          type: string
 *       profileImage:
 *          type: string
 *       
 */

 /**
 * @swagger
 * definitions:
 *   GetUser:
 *     properties:
 *       name:
 *         type: string
 *       email:
 *         type: string
 *       isEnable:
 *          type: boolean  
 *       isDeleted:
 *          type: boolean 
 *       country:
 *          type: string
 *       vatNumber:
 *          type: string
 *       profileImage:
 *          type: string
 *       
 */

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     tags:
 *       - Users
 *     description: Creates a new user
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: body
 *         description: User object
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/Register'
 *     responses:
 *       200:
 *         description: Successfully created
 *       204:
 *         description: Request body is empty or some parameters are missing 
 */
router.post('/register', db.register);

/**
 * @swagger
 * definitions:
 *   Login:
 *     properties:
 *       email:
 *         type: string
 *         required: true
 *       password:
 *         type: string
 *         required: true
 *       
 */

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     tags:
 *       - Users
 *     description: user login
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: body
 *         description: User object
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/Login'
 *     responses:
 *       200:
 *         description: Login successfully!
 *       204:
 *         description: Request body is empty or some parameters are missing 
 */
router.post('/login', db.login);


/**
 * @swagger
 * definitions:
 *   UserObject:
 *     properties:
 *       name:
 *         type: string
 *         required: true
 *       email:
 *         type: string
 *         required: true
 *       password:
 *          type: string
 *          required: true
 *       country:
 *          type: string
 *       vatNumber:
 *          type: string
 *          required: true
 *       profileImage:
 *          type: string
 *              
 *       
 */


/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     tags:
 *       - Users
 *     description: Updates a single user
 *     securityDefinitions:
 *         bearerAuth:
 *         type: http
 *         scheme: bearer  
 *         bearerFormat: JWT
 *         name: Authorization
 *         in: header
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: User's id
 *         in: path
 *         required: true
 *         type: string
 *       - name: user
 *         description: User object
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/UserObject'
 *     responses:
 *       200:
 *         description: Successfully updated
 */
router.put('/:id',jwt.isAuthorizedToken, db.updateUser);
router.post('/login-with-social', db.loginWithSocial)
router.put('/me',jwt.isAuthorizedToken, db.updateMe);
module.exports = router;
