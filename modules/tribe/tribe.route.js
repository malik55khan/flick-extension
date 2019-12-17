var express = require('express');
var router = express.Router();
var tribeCtrl = require('./tribe.ctrl');
var jwt = require('../../config/jwToken');

;


//POST
/**
 * @swagger
 * definitions:
 *   Tribe:
 *     properties:
 *       tribeName:
 *         type: string
 *         required: true 
 *   Member:
 *     properties:
 *       userEmailAddress:
 *         type: string
 *         required: true
 *       userPhoneNumber:
 *         type: string
 *         required: true
 *       status:
 *         type: string
 *         required: true
 *   Posts:
 *      properties:
 *       socialNetwork:
 *         type: string
 *         required: true
 *       postUrl:
 *         type: string
 *         required: true
 *       boostType:
 *         type: string
 *         required: true      
 *       boostCampaignStarts:
 *         type: string
 *         required: true
 *       boostCampaignEnds:
 *         type: string
 *         required: true
 *       
 */
//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZGViZmEyYjA3OWZkZjRlM2JhZjlkN2EiLCJlbWFpbCI6ImtoYW5AZ21haWwuY29tIiwiaWF0IjoxNTc2MDAwMzA2LCJleHAiOjE1NzYwODY3MDZ9.RmeaJZ50xrJ82_yODUN6grLCKgzVqIuXV0xK3B59QUw
 /**
 * @swagger
 * /api/tribes:
 *   get:
 *     security:
 *       - Bearer: []
 *     tags:
 *       - Tribes
 *     description: Get all tribe of a customer
 *     produces:
 *       - application/json
 *     parameters:
 *         description: Tribe object
 *         schema:
 *           $ref: '#/definitions/Tribe'
 *     responses:
 *       200:
 *         description: Successfully created
 *       204:
 *         description: Request body is empty or some parameters are missing 
 * securityDefinitions:
 *  Bearer:
 *   type: apiKey
 *   name: Authorization
 *   in: header
 */
router.route('/').get(jwt.isAuthorizedToken,tribeCtrl.getCustomerTribe);// Get Customer All Tribes
/**
* @swagger
 * /api/tribes/{tribeId}:
 *   get:
 *     security:
 *       - Bearer: []
 *     tags:
 *       - Tribes
 *     description: Get single tribe of a customer
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: tribeId
 *         in: path
 *         required: true
 *         type: string
 *         description: Tribe object
 *         schema:
 *           $ref: '#/definitions/Tribe'
 *     responses:
 *       200:
 *         description: Successfully created
 *       204:
 *         description: Tribe id is missing 
 */
router.route('/:tribeId').get(jwt.isAuthorizedToken,tribeCtrl.getCustomerTribeById);// Get Customer Single Tribes

/**
* @swagger
 * /api/tribes/invite{tribeId}:
 *   get:
 *     tags:
 *       - Tribes
 *     description: Tribe invitation link
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: tribeId
 *         in: path
 *         required: true
 *         type: string
 *         schema:
 *           $ref: '#/definitions/Tribe'
 *     responses:
 *       200:
 *         description: Successfully created
 *       204:
 *         description: Tribe id is missing 
 */
router.route('/invite/:tribeId').get(tribeCtrl.inviteLink);// Tribe invitation link
/**
* @swagger
 * /api/tribes/{tribeId}/members:
 *   get:
 *     security:
 *       - Bearer: []
 *     tags:
 *       - Tribes
 *     description: Get tribe members of a customer
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: tribeId
 *         in: path
 *         required: true
 *         type: string
 *         description: Tribe object
 *         schema:
 *           $ref: '#/definitions/Tribe'
 *     responses:
 *       200:
 *         description: Successfully created
 *       204:
 *         description: Tribe id is missing 
 */
router.route('/:tribeId/members').get(jwt.isAuthorizedToken, tribeCtrl.getCustomerTribeMembers);// Get Customer Tribes

/**
 * @swagger
 * /api/tribes:
 *   post:
 *     tags:
 *       - Tribes
 *     description: Creates a new tribe
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: body
 *         description: Tribe object
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/Tribe'
 *     responses:
 *       200:
 *         description: Successfully created
 *       204:
 *         description: Tribe id missing 
 */
router.route('/').post(jwt.isAuthorizedToken, tribeCtrl.createTribe);// Create a new tribe
/**
* @swagger
 * /api/tribes/{tribeId}/members:
 *   post:
 *     security:
 *       - Bearer: []
 *     tags:
 *       - Tribes
 *     description: invite a new member to the tribe
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: tribeId
 *         in: path
 *         required: true
 *         type: string
 *       - name: body
 *         in: body 
 *         description: Tribe object
 *         schema:
 *           $ref: '#/definitions/Member'
 *     responses:
 *       200:
 *         description: Successfully created
 *       204:
 *         description: Tribe id is missing 
 */        
 
router.route('/:tribeId/members').post(jwt.isAuthorizedToken, tribeCtrl.InviteMember);//invite a new member to the tribe


/**
* @swagger
 * /api/tribes/{tribeId}/posts:
 *   post:
 *     security:
 *       - Bearer: []
 *     tags:
 *       - Tribes
 *     description: add a new post to the tribe
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: tribeId
 *         in: path
 *         required: true
 *         type: string
 *       - name: body
 *         in: body 
 *         description: Post object
 *         schema:
 *           $ref: '#/definitions/Posts'
 *     responses:
 *       200:
 *         description: Successfully created
 *       204:
 *         description: Tribe id is missing 
 */
router.route('/:tribeId/posts').post(jwt.isAuthorizedToken, tribeCtrl.addPost);//add a new post to the tribe

/**
* @swagger
 * /api/tribes/{tribeId}/posts/{:postId}:
 *   post:
 *     security:
 *       - Bearer: []
 *     tags:
 *       - Tribes
 *     description: update of post by customer
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: tribeId
 *         in: path
 *         required: true
 *         type: string
 *       - name: postId
 *         in: path
 *         required: true
 *         type: string
 *       - name: body
 *         in: body 
 *         description: Post object
 *         schema:
 *           $ref: '#/definitions/Posts'
 *     responses:
 *       200:
 *         description: Successfully created
 *       204:
 *         description: Tribe id postId is missing 
 */
router.route('/:tribeId/posts/:postId').put(jwt.isAuthorizedToken, tribeCtrl.updatePost);//update of post by customer


/**
* @swagger
 * /api/tribes/{tribeId}/members:
 *   put:
 *     security:
 *       - Bearer: []
 *     tags:
 *       - Tribes
 *     description: accept invitation to join the tribe
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: tribeId
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Successfully created
 *       204:
 *         description: Tribe id is missing 
 */
router.route('/:tribeId/members').put(jwt.isAuthorizedToken, tribeCtrl.acceptInvitition);//accept invitation to join the tribe

/**
* @swagger
 * /api/tribes/{tribeId}/members/{:memberId}:
 *   delete:
 *     security:
 *       - Bearer: []
 *     tags:
 *       - Tribes
 *     description: accept invitation to join the tribe
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: tribeId
 *         in: path
 *         required: true
 *         type: string
 *       - name: memberId
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Successfully created
 *       204:
 *         description: Tribe id, memberId is missing 
 */
router.route('/:tribeId/members/:memberId').delete(jwt.isAuthorizedToken, tribeCtrl.removeMember);//uremove a user from the tribe;

/**
* @swagger
 * /api/tribes/{tribeId}/members:
 *   delete:
 *     security:
 *       - Bearer: []
 *     tags:
 *       - Tribes
 *     description: remove me from the tribe //Members on extensions
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: tribeId
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Successfully created
 *       204:
 *         description: Tribe id, memberId is missing 
 */
router.route(`/:tribeId/members`).delete(jwt.isAuthorizedToken,tribeCtrl.removeMe); //- remove me from the tribe

/**
* @swagger
 * /api/tribes/{tribeId}:
 *   delete:
 *     security:
 *       - Bearer: []
 *     tags:
 *       - Tribes
 *     description: remove me from the tribe //Members on extensions
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: tribeId
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Successfully deleted
 *       204:
 *         description: Tribe id is missing 
 */
router.route(`/:tribeId`).delete(jwt.isAuthorizedToken,tribeCtrl.deleteTribe); //- remove me from the tribe

module.exports = router;
