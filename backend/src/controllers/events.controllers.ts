import { Request, Response, RequestHandler } from 'express';
import { getOpenEvents, 
         eventDetails, 
         addEvent, 
         updateEventDB, 
         addEventRSVP,
         removeEventRSVP,
         eventAttendees } from '../services/event.services.js';


const getAllEvents: RequestHandler = async (req: Request, res: Response) => {
    try {
        const events =await getOpenEvents();
        if (!events) {
            res.status(400).json({message: "Error loading events" })
        };
        res.status(200).json(events);
    } catch (error) {
        console.log("Error in get all events controller", error);
        res.status(500).json({message: "Internal Server Error"});
    };
}

const getEventDetails: RequestHandler = async (req: Request, res: Response) => {
 
    const { eventId } = req.params
    try {
        const event = await eventDetails(parseInt(eventId));
        if (!event) {
            res.status(404).json({message: "Event not found" })
        };
        res.status(200).json(event);
    } catch (error) {
        console.log("Error in get event details controller", error);
        res.status(500).json({message: "Internal Server Error"});
    }
}

const addNewEvent: RequestHandler = async (req: Request, res: Response) => {
    const data = req.body;
    try {
        const newEvent = await addEvent(data);
        if (!newEvent) {
            res.status(400).json({message: "Error creating new event" })
        }
        res.status(201).json(newEvent)
    } catch (error) {
        console.log("Error in add new event  controller", error);
        res.status(500).json({message: "Internal Server Error"});
    }
}

const updateEvent: RequestHandler = async (req: Request, res: Response) => { 
    try {
        const data = req.body;
        const { eventId} = req.params;
        const updatedEvent = await updateEventDB(data, parseInt(eventId));
        if (!updatedEvent) {
            res.status(400).json({message: "Controller error updating event"})
        }
        res.status(200).json(updatedEvent);
    } catch (error) {
        console.log("Error in add new event  controller", error);
        res.status(500).json({message: "Internal Server Error"});
    }
}

const RsvpForEvent: RequestHandler = async (req: Request, res: Response) => {
    try {
        const { eventId } = req.params;
        const userId: number = req.userId!

        const success = await addEventRSVP(userId, parseInt(eventId));
        if (!success) {
            res.status(400).json({message: "Controller function error adding rsvp"});
        }
        res.status(204).send();
    } catch (error) {
        console.log("Server error in add rsvp controller", error);
        res.status(500).json({message: "Internal Server Error"});
    }
}

const cancelRsvpForEvent: RequestHandler = async (req: Request, res: Response) => {
    try {
        const { eventId } = req.params;
        const userId: number = req.userId!

        const success = await removeEventRSVP(userId, parseInt(eventId));
        if (!success) {
            res.status(400).json({message: "Controller function error removing rsvp"});
        }
        res.status(204).send();
    } catch (error) {
        console.log("Server error in remove rsvp controller", error);
        res.status(500).json({message: "Internal Server Error"});
    }
}

const getEventAttendees: RequestHandler = async (req: Request, res: Response) => {
    try {
        const { eventId } = req.params;
        const attendees = await eventAttendees(parseInt(eventId));  
        if (attendees.length < 1) {
            res.status(400).json({message: "No event attedees found"});
        } 
        res.status(200).json(attendees);
    } catch (error) {
        console.log("Server error in fetch all attendees controller", error);
        res.status(500).json({message: "Internal Server Error"});
    }
}

export { getAllEvents, 
        getEventDetails, 
        RsvpForEvent, 
        addNewEvent, 
        updateEvent, 
        cancelRsvpForEvent, 
        getEventAttendees, 
 }