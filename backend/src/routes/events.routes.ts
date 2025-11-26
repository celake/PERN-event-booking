import express from 'express';
import {
    getAllEvents,
    getEventDetails,
    rsvpForEvent,
    createNewEvent,
    updateEvent,
    cancelRsvpForEvent,
    getEventAttendees,
    
} from "../controllers/events.controllers.js";

import { protectRoute, requireOrganizer, decodeUser } from '../middleware/auth.middleware.js'

const router = express.Router();

router.get('/', getAllEvents);

router.post('/', protectRoute, createNewEvent);

router.patch('/:eventId', protectRoute, updateEvent);

router.post('/:eventId/rsvp', protectRoute, rsvpForEvent);

router.delete('/:eventId/rsvp', protectRoute, cancelRsvpForEvent);

router.get("/:eventId/attendees", protectRoute, requireOrganizer, getEventAttendees)

router.get('/:eventId', decodeUser, getEventDetails);


export default router;