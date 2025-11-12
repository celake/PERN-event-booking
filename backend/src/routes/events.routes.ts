import express from 'express';
import {
    getAllEvents,
    getEventDetails,
    RsvpForEvent,
    addNewEvent,
    updateEvent,
    cancelRsvpForEvent,
    getEventAttendees,
    
} from "../controllers/events.controllers.js";

import { protectRoute, requireOrganizer } from '../middleware/auth.middleware.js'

const router = express.Router();

router.get('/', getAllEvents);

router.post('/', protectRoute, addNewEvent);

router.patch('/:eventId', protectRoute, updateEvent);

router.post('/:eventId/rsvp', protectRoute, RsvpForEvent);

router.delete('/:eventId/rsvp', protectRoute, cancelRsvpForEvent);

router.get("/:eventId/attendees", protectRoute, requireOrganizer, getEventAttendees)

router.get('/:eventId', getEventDetails);


export default router;