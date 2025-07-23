import express from 'express';
import { shorten, redirect } from '../controllers/urlController.js';
import { authenticate } from '../middlewares/authenticate.js';

const router = express.Router();

router.post('/shorten', authenticate, shorten);
router.get('/:code', redirect);

export default router;