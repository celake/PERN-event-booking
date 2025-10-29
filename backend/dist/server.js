import express from 'express';
const app = express();
const PORT = process.env.PORT || 3000;
app.get("/", (req, res) => {
    res.send("Hey it's working...");
});
app.listen(PORT, () => {
    console.log(`now listening on port ${PORT}`);
});
