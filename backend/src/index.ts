import express, { type Request, type Response } from "express";
import { connectDB } from "./utils/db.js";
import Version1 from "./routes/v1/index.js"
import cors from "cors"
import { FRONTEND_URL, PORT } from "./config.js";




connectDB();
const app = express();
app.use(express.json())
app.use(cors({
    origin: [FRONTEND_URL ]
}))

app.use("/api/v1", Version1);


app.get('/health', (req: Request, res: Response) => res.send("Server is healthy"))

app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`)
})