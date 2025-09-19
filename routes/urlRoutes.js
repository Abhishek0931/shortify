import express from 'express';
import { shorten, redirect } from '../controllers/urlController.js';
import {authenticate} from '../middlewares/authenticate.js';
import { getUserUrls } from '../controllers/urlController.js';

const router = express.Router();

router.post('/shorten', authenticate, shorten);
// Require authentication for user-specific routes
router.get('/my', authenticate, getUserUrls);
// You may want to keep the public redirect route outside authentication
router.get('/:code', redirect);

export default router;