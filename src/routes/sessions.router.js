import { Router } from "express";
import sessionsController from "../controllers/sessions.controller.js";

const router = Router();

/**
 * @swagger
 * /api/sessions/register:
 *   post:
 *     summary: Register a new session
 *     tags: [Sessions]
 *     responses:
 *       200:
 *         description: Session registered successfully
 */
router.post("/register", sessionsController.register);

/**
 * @swagger
 * /api/sessions/login:
 *   post:
 *     summary: Login to a session
 *     tags: [Sessions]
 *     responses:
 *       200:
 *         description: Logged in successfully
 */
router.post("/login", sessionsController.login);

/**
 * @swagger
 * /api/sessions/current:
 *   get:
 *     summary: Get current session
 *     tags: [Sessions]
 *     responses:
 *       200:
 *         description: Current session retrieved successfully
 */
router.get("/current", sessionsController.current);

/**
 * @swagger
 * /api/sessions/unprotectedLogin:
 *   get:
 *     summary: Unprotected login
 *     tags: [Sessions]
 *     responses:
 *       200:
 *         description: Unprotected login successful
 */
router.get("/unprotectedLogin", sessionsController.unprotectedLogin);

/**
 * @swagger
 * /api/sessions/logout:
 *   post:
 *     summary: Logout from a session
 *     tags: [Sessions]
 *     responses:
 *       200:
 *         description: Logged out successfully
 */
router.post("/logout", sessionsController.logout);

/**
 * @swagger
 * /api/sessions/unprotectedCurrent:
 *   get:
 *     summary: Get unprotected current session
 *     tags: [Sessions]
 *     responses:
 *       200:
 *         description: Unprotected current session retrieved successfully
 */
router.get("/unprotectedCurrent", sessionsController.unprotectedCurrent);

export default router;
