import express from 'express';

import { 
    getUserDashboard, 
    updateUserProfile,
    deleteUserProfile, 
    getUserFavorites,
    addEventToFavorites, 
    removeEventFromFavorites } from '../controllers/users.controllers.js';

   const router = express.Router();
   
   router.get('/', getUserDashboard);

   router.patch('/', updateUserProfile);

   router.delete('/', deleteUserProfile);
   
   router.get('/favorites', getUserFavorites)

   router.post('/favorites/:eventId', addEventToFavorites);

   router.delete('/favorites/:eventId', removeEventFromFavorites);


   export default router;

