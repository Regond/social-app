import Express from 'express';
import { getJoins, Join, Separate } from '../controllers/join.js';

const router = Express.Router()

router.get('/', getJoins)
router.post('/', Join)
router.delete('/', Separate)

export default router;