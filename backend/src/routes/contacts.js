const express = require("express");
const {
  getContacts,
  createContact,
  updateContact,
  deleteContact,
} = require("../controllers/contactController");

const auth = require("../middlewares/authMiddleware");

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
