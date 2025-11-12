import { Request, Response, RequestHandler } from 'express';


const allNotifications: RequestHandler = async (req: Request, res: Response) => {
    res.send("All notifications here. ")
}

const notificationDetails: RequestHandler = async (req: Request, res: Response) => {
    res.send("One notification here. ")
}

const saveNotification: RequestHandler = async (req: Request, res: Response) => {
    // try {
    //     const userId: number = req.userId!
    //     const { eventId } = req.params;
    //     const { message } = req.body; 
        
    // } catch (error) {
        
    // }
    res.send("This notification has been created, but not sent")
    
}

const sendNotification: RequestHandler = async (req: Request, res: Response) => {
    // try {
    //     const { eventId } = req.params;
    //     const notification = req.body; 

    // } catch (error) {
        
    // }
    
    res.send(`Sending a notification to all attendees`);
}

const updateNotification: RequestHandler = async (req: Request, res: Response) => {
    res.send("This notification has been updated, but not sent")
}

const markNotificationReadState: RequestHandler = async (req: Request, res: Response) => {
    res.send("This notification has been read or maybe unread.  Who knows. ")
}

const deleteNotification: RequestHandler = async (req: Request, res: Response) => {
    res.send("This notification has been deleted. ")
}

export { allNotifications, 
        notificationDetails, 
        saveNotification, 
        sendNotification, 
        updateNotification,  
        markNotificationReadState, 
        deleteNotification}