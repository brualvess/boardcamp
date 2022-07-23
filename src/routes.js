import { Router } from 'express';
import { 
    createCategories,
    listCategories
} from './controllers/categoriesControllers.js';
import {
     createGames,
     listGames
     } from './controllers/gamesControllers.js';
import { createCustomers,
         listCustomers,
         listWithId,
         updateCustomers
} from './controllers/customersControllers.js';

const router = Router()

// Category routes
router.post('/categories', createCategories)
router.get('/categories', listCategories)

// Game routes
router.post('/games', createGames)
router.get('/games', listGames)

// Customer routes
router.post('/customers', createCustomers)
router.get('/customers', listCustomers)
router.get('/customers/:id', listWithId)
router.put('/customers/:id', updateCustomers)

export default router;