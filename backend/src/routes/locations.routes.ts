import express from 'express';
import { getActiveLocations,
         createLocation,
         searchLocations,
         archiveLocationById
} from "../controllers/locations.controllers.js";

import { protectRoute, requireOrganizer } from '../middleware/auth.middleware.js'

const router = express.Router();

router.get('/', protectRoute, requireOrganizer, getActiveLocations);

router.post('/', protectRoute, requireOrganizer, createLocation);

router.get('/search', protectRoute, requireOrganizer, searchLocations);

router.patch('/:id', protectRoute, requireOrganizer, archiveLocationById)

export default router;