import express from 'express';
import ping from './ping/ping';
import getGhostDialogueDialogueIdSkeleton from './ghostDialogue/getGhostDialogueDialogueIdSkeleton';
import getGhostDialogueDialogueIdTranslationLanguage from './ghostDialogue/getGhostDialogueDialogueIdTranslationLanguage';

/**
 * @swagger
 * tags:
 *   - name: Health
 *   - name: GhostDialogue
 */
const router = express.Router();

/**
 * @swagger
 * /ping:
 *   get:
 *     tags: [Health]
 *     summary: Ping
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "pong"
 */
router.get('/ping', ping);

/**
 * @swagger
 * /ghost/dialogue/{dialogueId}/skeleton:
 *   get:
 *     tags: [GhostDialogue]
 *     summary: Get skeleton of the dialogue in ghost format
 *     parameters:
 *       - in: path
 *         name: dialogueId
 *         required: true
 *         schema:
 *           type: string
 *         description: Id of the dlg file
 *         example: "annah"
 *     responses:
 *       200:
 *         description: Skeleton of the dialogue in ghost format
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *             example: "export const annahDialogueSkeleton = {...}"
 *       400:
 *         description: File not found or invalid request
 */
router.get('/ghost/dialogue/:dialogueId/skeleton', getGhostDialogueDialogueIdSkeleton);

/**
 * @swagger
 * /ghost/dialogue/{dialogueId}/translation/{language}:
 *   get:
 *     tags: [GhostDialogue]
 *     summary: Get translation of the dialogue in ghost format
 *     parameters:
 *       - in: path
 *         name: dialogueId
 *         required: true
 *         schema:
 *           type: string
 *         description: Id of the dlg file
 *         example: "annah"
 *       - in: path
 *         name: language
 *         required: true
 *         schema:
 *           type: string
 *           enum: [ru_RU, en_US]
 *         example: "ru_RU"
 *     responses:
 *       200:
 *         description: Translation of the dialogue in ghost format
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "export const annahDialogueTranslation = {...}"
 *       400:
 *         description: File not found or invalid request
 */
router.get('/ghost/dialogue/:dialogueId/translation/:language', getGhostDialogueDialogueIdTranslationLanguage);

export default router;
