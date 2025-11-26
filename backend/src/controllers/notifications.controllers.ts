import { Request, Response, RequestHandler } from 'express';
import { saveNotificationToDB, 
         getUserEventNotifications, 
         getOrganizerEventNotifications,
         getNotificationDetailsFromDb, 
         updateNotificationInDb,
         sendNotificationToUsers,
         checkNotificationStatus,
         deleteUserNotificationFromDB,
         deleteDraftNotificationFromDB,
        toggleReadStatus } from '../services/notification.services.js';
import { ConflictError,
         DatabaseError,
         NotFoundError
 } from "../lib/errors.js";

const getUserNotifications: RequestHandler = async (req: Request, res: Response) => {
    try {
        const userId: number = req.userId!;
        const notifications = await getUserEventNotifications(userId);

        res.status(200).json(notifications)
    } catch (error) {
        console.error("Error in getUserNotifications controller: ", error);
        res.status(500).json({message: "Internal server error"})
    } 
}

const getOrganizerNotifications: RequestHandler = async (req: Request, res: Response) => {
    try {
        const userId: number = req.userId!;
        const [received, sent] = await Promise.all([
            getUserEventNotifications(userId),
            getOrganizerEventNotifications(userId)
        ])
        
        res.status(200).json({
            received,
            sent
        })
    } catch (error) {
        console.error("Error in getOrganizerNotifications Controller: ", error);
        res.status(500).json({message: "Internal server error"});
    }
}

const getNotificationDetails: RequestHandler = async (req: Request, res: Response) => {
    try {
        const notificationId: number = parseInt(req.params.notificationId, 10);
        const userId: number = req.userId!;
        const notification = await getNotificationDetailsFromDb(notificationId, userId);

        res.status(200).json(notification)
    } catch (error) {
        if (error instanceof NotFoundError) return res.status(404).json({ message: error.message });
        if (error instanceof DatabaseError) return res.status(500).json({ message: error.message });
        console.error("Error in getNotificationDetails controller: ", error);
        res.status(500).json({message: "Internal server error"});
    }
}

const saveNotification: RequestHandler = async (req: Request, res: Response) => {
    try {
        const senderId: number = req.userId!
        const { eventId, subject, message } = req.body; 
        const success = await saveNotificationToDB(eventId, senderId, subject, message);

        res.status(204).send();
        
    } catch (error) {
        if (error instanceof DatabaseError) return res.status(500).json({ message: error.message });
        console.error("Error in saveNotification controller: ", error);
        res.status(500).json({message: "Internal server error"})
    }
}

const sendNotification: RequestHandler = async (req: Request, res: Response) => {
    try {
        const notificationId: number = parseInt(req.params.id);
        const sentCount = await sendNotificationToUsers(notificationId);
        res.status(200).json({ sentCount })
    } catch (error: any) {
        if (error instanceof ConflictError) return res.status(409).json({ message: error.message });
        if (error instanceof DatabaseError) return res.status(400).json({ message: error.message });
        console.error("Error in sendNotification controller: ", error);
        res.status(500).json({message: "Internal server error"})
    }
}

const updateNotification: RequestHandler = async (req: Request, res: Response) => {
    try {
        const notificationId: number = parseInt(req.params.id);
        const { event_id, subject, message } = req.body;
        const validateStatus = await checkNotificationStatus(notificationId);
        const success = await updateNotificationInDb(event_id, subject, message, notificationId);
        res.status(200).json({event_id, subject, message})
    } catch (error) {
        if (error instanceof DatabaseError) return res.status(400).json({ message: error.message });
        console.error("Error in updateNotification controller: ", error);
        res.status(500).json({message: "Internal server error"})
    }
}

const markNotificationReadState: RequestHandler = async (req: Request, res: Response) => {
    try {
        const notificationId: number = parseInt(req.params.id);
        const userId: number = req.userId!;
        console.log({notificationId})
        console.log({userId})
        const result = toggleReadStatus(notificationId, userId);
        res.status(204).send();
    } catch (error) {
        if (error instanceof DatabaseError) return res.status(400).json({ message: error.message });
        console.error("Error in markNotificationReadState controller: ", error);
        res.status(500).json({message: "Internal server error"})
    }
}

const deleteUserNotification: RequestHandler = async (req: Request, res: Response) => {
    try {
        const notificationId: number = parseInt(req.params.id);
        const userId: number = req.userId!;
        deleteUserNotificationFromDB(notificationId, userId);
        res.status(204).send();
    } catch (error) {
       if (error instanceof DatabaseError) return res.status(400).json({ message: error.message });
       console.error("Error in markNotificationReadState controller: ", error);
       res.status(500).json({message: "Internal server error"}) 
    }
}

const deleteDraftNotification: RequestHandler = async (req: Request, res: Response) => {
    try {
        const notificationId: number = parseInt(req.params.id);
        const userId: number = req.userId!;
        deleteDraftNotificationFromDB(notificationId, userId);
        res.status(204).send();
    } catch (error) {
       if (error instanceof DatabaseError) return res.status(400).json({ message: error.message });
       console.error("Error in deleteDraftNotification controller: ", error);
       res.status(500).json({message: "Internal server error"}) 
    }
}

export { getUserNotifications, 
        getOrganizerNotifications,
        getNotificationDetails, 
        saveNotification, 
        sendNotification, 
        updateNotification,  
        markNotificationReadState, 
        deleteUserNotification, 
        deleteDraftNotification}