import { Request, Response, RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { getOpenEventsFromDb, 
         getEventDetailsFromDb, 
         addEventInDb, 
         updateEventInDb, 
         addEventRsvpInDb,
         removeEventRsvpInDb,
         eventAttendeesFromDB,
         eventAttendeesCountFromDB,
        getEventOrganizers } from '../services/event.services.js';
import { NotFoundError, DatabaseError } from '../lib/errors.js';


const getAllEvents: RequestHandler = async (req: Request, res: Response) => {
    try {
        const events =await getOpenEventsFromDb();
        res.status(200).json(events);
    } catch (error) {
        console.error("Error in getAllEvents controller:", error)
        res.status(500).json({message: "Internal Server Error"});
    };
}

const getEventDetails: RequestHandler = async (req: Request, res: Response) => {
    try {
        const { eventId } = req.params;
        const event = await getEventDetailsFromDb(parseInt(eventId));
        const eventOrganizer = await getEventOrganizers(parseInt(eventId));
        const userId = req.userId;
        if (userId && eventOrganizer.includes(userId)) {
            const attendees = await eventAttendeesCountFromDB(parseInt(eventId));
            return res.status(200).json({ event, attendees })
        }
        res.status(200).json(event);
    } catch (error) {
        if (error instanceof NotFoundError) return res.status(404).json({ message: error.message });
        console.error("Error in get event details controller", error);
        res.status(500).json({message: "Internal Server Error"});
    }
}

const createNewEvent: RequestHandler = async (req: Request, res: Response) => {
    const data = req.body;
    const userId: number = req.userId!
    try {
        const newEvent = await addEventInDb(data, userId);
        res.status(201).json(newEvent)
    } catch (error) {
        if (error instanceof DatabaseError) return res.status(404).json({ message: error.message });
        console.error("Error in add new event controller", error);
        res.status(500).json({message: "Internal Server Error"});
    }
}

const updateEvent: RequestHandler = async (req: Request, res: Response) => { 
    try {
        const data = req.body;
        const { eventId } = req.params;
        const updatedEvent = await updateEventInDb(data, parseInt(eventId));

        res.status(200).json(updatedEvent);
    } catch (error) {
        if (error instanceof DatabaseError) return res.status(500).json({ message: error.message });
        console.error("Error in update event controller", error);
        res.status(500).json({message: "Internal Server Error"});
    }
}

const rsvpForEvent: RequestHandler = async (req: Request, res: Response) => {
    try {
        const { eventId } = req.params;
        const userId: number = req.userId!
        await addEventRsvpInDb(userId, parseInt(eventId));
   
        res.status(204).send();
    } catch (error) {
        if (error instanceof DatabaseError) return res.status(500).json({ message: error.message });
        console.error("Server error in add rsvp controller", error);
        res.status(500).json({message: "Internal Server Error"});
    }
}

const cancelRsvpForEvent: RequestHandler = async (req: Request, res: Response) => {
    try {
        const { eventId } = req.params;
        const userId: number = req.userId!
        const success = await removeEventRsvpInDb(userId, parseInt(eventId));

        res.status(204).send();
    } catch (error) {
        if (error instanceof DatabaseError) return res.status(500).json({ message: error.message });
        console.error("Server error in remove rsvp controller", error);
        res.status(500).json({message: "Internal Server Error"});
    }
}

const getEventAttendees: RequestHandler = async (req: Request, res: Response) => {
    try {
        const { eventId } = req.params;
        const attendees = await eventAttendeesFromDB(parseInt(eventId));  
        res.status(200).json(attendees);
    } catch (error) {
        console.error("Server error in fetch all attendees controller", error);
        res.status(500).json({message: "Internal Server Error"});
    }
}

export { getAllEvents, 
        getEventDetails, 
        rsvpForEvent, 
        createNewEvent, 
        updateEvent, 
        cancelRsvpForEvent, 
        getEventAttendees, 
 }