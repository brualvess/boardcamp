import { Router } from 'express';
import { 
    createCategories,
    listCategories
} from './controllers/categoriesControllers.js';
import {
     createGames,
     listGames
     } from './controllers/gamesControllers.js';

const router = Router()

router.post('/categories', createCategories)
router.get('/categories', listCategories)
router.post('/games', createGames)
router.get('/games', listGames)

export default router;