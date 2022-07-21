import { Router } from 'express';
import { createCategories } from './controllers/categoriesControllers.js';

const router = Router()

router.post('/categories', createCategories)


export default router;