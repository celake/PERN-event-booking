import express from "express";
import {
  requireOrganizer,
  protectRoute,
} from "../middleware/auth.middleware.js";
import {
  getUserNotifications,
  getOrganizerNotifications,
  saveNotification,
  updateNotification,
  getNotificationDetails,
  markNotificationReadState,
  deleteUserNotification,
  deleteDraftNotification,
  sendNotification,
} from "../controllers/notifications.controllers.js";

const router = express.Router();

router.get("/user", protectRoute, getUserNotifications); //User notifications

router.get("/organizer", protectRoute, requireOrganizer, getOrganizerNotifications); //Organizer notifications

router.get("/details/:notificationId", protectRoute, getNotificationDetails); // notification details

router.post("/save", protectRoute, requireOrganizer, saveNotification); // save draft

router.post("/send/:id", protectRoute, requireOrganizer, sendNotification); // send notification

router.patch("/update/:id", protectRoute, requireOrganizer, updateNotification); // update draft

router.patch("/is_read/:id", protectRoute, markNotificationReadState); // toggle read/unread

router.delete("/draft/:id", protectRoute, requireOrganizer, deleteDraftNotification) // remove draft notification from organizer's list

router.delete("/:id", protectRoute, deleteUserNotification); // delete notification from user account

export default router;
