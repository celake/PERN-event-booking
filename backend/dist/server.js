import express from 'express';
import dotenv from 'dotenv';
import eventRoutes from './routes/events.routes.js';
import authRoutes from './routes/auth.routes.js';
import notificationRoutes from './routes/notifications.routes.js';
import usersRoutes from './routes/users.routes.js';
const PORT = process.env.PORT || 3000;
const app = express();
dotenv.config();
app.use(express.json());
app.use("/api/events", eventRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/users", usersRoutes);
app.get("/", (req, res) => {
    res.send("Hey it's working...");
});
app.listen(PORT, () => {
    console.log(`now listening on port ${PORT}`);
});
