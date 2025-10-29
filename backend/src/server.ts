import express, { Request, Response } from 'express';
import env from 'dotenv';

const app = express();

const PORT = process.env.PORT || 3000;

app.get("/", (req: Request, res: Response) => {
    res.send("Hey it's working...")
});

app.listen(PORT, () => {
    console.log(`now listening on port ${PORT}`)
})