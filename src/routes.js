import { Router } from 'express';
import { 
    createCategories,
    listCategories
} from './controllers/categoriesControllers.js';

const router = Router()

router.post('/categories', createCategories)
router.get('/categories', listCategories)

export default router;