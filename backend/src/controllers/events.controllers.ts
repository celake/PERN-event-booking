import { Request, Response, RequestHandler } from 'express';


const getAllEvents: RequestHandler = async (req: Request, res: Response) => {
    res.send("Getting all events api route ")
}

const getEventDetails: RequestHandler = async (req: Request, res: Response) => {
    const { eventId } = req.params;

    res.send(`Getting details for event with id: ${eventId}`);
}

const addNewEvent: RequestHandler = async (req: Request, res: Response) => {
    const { name, date, description  } = req.body
    res.send(`New event: ${name} - ${description} on ${date}`);
}

const updateEvent: RequestHandler = async (req: Request, res: Response) => {
    res.send(`Changing Event to: ${req.body}`);
}

const RsvpForEvent: RequestHandler = async (req: Request, res: Response) => {
    const { eventId } = req.params;
    const { userId } = req.body
    res.send(`RSVP for event with id: ${eventId} and user id: ${userId}`);
}

const cancelRsvpForEvent: RequestHandler = async (req: Request, res: Response) => {
    const { eventId } = req.params;
    res.send(`Deleting the RSVP for event ${eventId}`)
}

const sendEventNotification: RequestHandler = async (req: Request, res: Response) => {
    const { eventId } = req.params;
    res.send(`Sending a notification to all attendees for event ${eventId}`)
}

const getEventAttendees: RequestHandler = async (req: Request, res: Response) => {
    const { eventId } = req.params;
    res.send(`get all the attendees for event ${eventId}`)
}

export { getAllEvents, getEventDetails, RsvpForEvent, addNewEvent, updateEvent, cancelRsvpForEvent, getEventAttendees, sendEventNotification }