const express = require("express");
const {
  getContacts,
  createContact,
  updateContact,
  deleteContact,
} = require("../controllers/contactController");

const auth = require("../middlewares/requireAuth");

const router = express.Router();

router.use(auth);

router.get("/", getContacts);
router.post("/", createContact);
router.patch("/:id", updateContact);
router.delete("/:id", deleteContact);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Contacts
 *   description: Gestion des contacts (protégé par JWT)
 *
 * components:
 *   schemas:
 *     Contact:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "650a1b2c3d4e5f6a7b8c9d0e"
 *         firstName:
 *           type: string
 *           example: "Jean"
 *         lastName:
 *           type: string
 *           example: "Dupont"
 *         phone:
 *           type: string
 *           example: "0612345678"
 *         email:
 *           type: string
 *           example: "jean.dupont@email.com"
 *         owner:
 *           type: string
 *           example: "650a1b2c3d4e5f6a7b8c9d0e"
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     Error:
 *       type: object
 *       properties:
 *         error:
 *           type: object
 *           properties:
 *             type:
 *               type: string
 *               example: "ValidationError"
 *             message:
 *               type: string
 *               example: "Le numéro de téléphone doit contenir entre 10 et 20 caractères."
 */

/**
 * @swagger
 * /contacts:
 *   get:
 *     summary: Récupérer tous mes contacts
 *     tags: [Contacts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des contacts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Contact'
 *             examples:
 *               exemple:
 *                 value:
 *                   - _id: "650a1b2c3d4e5f6a7b8c9d0e"
 *                     firstName: "Jean"
 *                     lastName: "Dupont"
 *                     phone: "0612345678"
 *                     email: "jean.dupont@email.com"
 *                     owner: "650a1b2c3d4e5f6a7b8c9d0e"
 *                     createdAt: "2023-09-19T12:00:00.000Z"
 *                     updatedAt: "2023-09-19T12:00:00.000Z"
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /contacts:
 *   post:
 *     summary: Créer un nouveau contact
 *     tags: [Contacts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - phone
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               phone:
 *                 type: string
 *               email:
 *                 type: string
 *               address:
 *                 type: string
 *     responses:
 *       201:
 *         description: Contact créé
 */

/**
 * @swagger
 * /contacts/{id}:
 *   patch:
 *     summary: Mettre à jour un contact
 *     tags: [Contacts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Contact mis à jour
 *       404:
 *         description: Contact non trouvé
 *
 *   delete:
 *     summary: Supprimer un contact
 *     tags: [Contacts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Contact supprimé
 *       404:
 *         description: Contact non trouvé
 */
