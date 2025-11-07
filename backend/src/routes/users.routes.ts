import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';

import { 
    getUserDashboard, 
    updateUser,
    deleteUserProfile, 
    getUserFavorites,
    addEventToFavorites, 
    removeEventFromFavorites } from '../controllers/users.controllers.js';

   const router = express.Router();
   
   router.get('/', protectRoute, getUserDashboard);

   router.patch('/', protectRoute, updateUser);

   router.delete('/', protectRoute, deleteUserProfile);
   
   router.get('/favorites', protectRoute, getUserFavorites)

   router.post('/favorites/:eventId', protectRoute, addEventToFavorites);

   router.delete('/favorites/:eventId', protectRoute, removeEventFromFavorites);


   export default router;

