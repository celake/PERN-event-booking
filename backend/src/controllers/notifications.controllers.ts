import { Request, Response, RequestHandler } from 'express';


const allNotifications: RequestHandler = async (req: Request, res: Response) => {
    res.send("All notifications here. ")
}

const notificationDetails: RequestHandler = async (req: Request, res: Response) => {
    res.send("One notification here. ")
}

const markNotificationReadState: RequestHandler = async (req: Request, res: Response) => {
    res.send("This notification has been read or maybe unread.  Who knows. ")
}

const deleteNotification: RequestHandler = async (req: Request, res: Response) => {
    res.send("This notification has been deleted. ")
}

export { allNotifications, notificationDetails, markNotificationReadState, deleteNotification}