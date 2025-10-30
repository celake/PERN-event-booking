import express from 'express';

import { 
    allNotifications, 
    notificationDetails, 
    markNotificationReadState,
    deleteNotification} from "../controllers/notifications.controllers.js";


const router = express.Router();

router.get("/", allNotifications);

router.get("/:notificationId", notificationDetails);

router.patch("/:notificationId/read", markNotificationReadState);

router.delete("/:notificationId", deleteNotification);

export default router;