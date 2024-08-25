import express, { Request, Response } from "express";
import Logger from "morgan"
import cors from "cors"
import "colors"
import cookieParser from "cookie-parser"
import 'dotenv/config'
import { errorHandler, notFound } from "./middlewares/errorHandler";
import connectDb from "./config/connect-db";
import UserRouter from "./routes/users/user.routes";
const app = express()

app.use(cors({ credentials: true }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(Logger("dev"))
app.use(cookieParser());

app.get('/', (req: Request, res: Response) => {
    res.send('Hello, p Express');
});

app.use("/api/users", UserRouter)
app.use(notFound)
app.use(errorHandler)

// routes

const PORT = process.env.PORT || 3000
// connect to database
connectDb().then((res: any) => {
    app.listen(PORT, async () => {
        console.log(`server started on localhost:${PORT}`.red)


    })

})