import express from 'express';

import { 
    allNotifications, 
    saveNotification,
    updateNotification,
    notificationDetails, 
    markNotificationReadState,
    deleteNotification,
    sendNotification} from "../controllers/notifications.controllers.js";


const router = express.Router();

router.get("/", allNotifications); //All notifications

router.get("/:notificationId", notificationDetails); // notification details

router.post("/", saveNotification); // save draft

router.post("/send", sendNotification);  // send notification

router.post("/update", updateNotification) // update draft

router.patch("/:notificationId/read", markNotificationReadState); // toggle read/unread

router.delete("/:notificationId", deleteNotification); // delete notification draft

export default router;