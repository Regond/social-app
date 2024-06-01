import Express from 'express';
import { getGroups, addGroup, deleteGroup, getGroup, getGroupName } from '../controllers/group.js';

const router = Express.Router()
router.get('/', getGroups)
router.get('/find/:id', getGroup)
router.get('/findName/:name', getGroupName)
router.post('/', addGroup)
router.delete('/:id', deleteGroup)

export default router;