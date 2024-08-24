import express from "express";
import Logger from "morgan"
import cors from "cors"
import "colors"
import cookieParser from "cookie-parser"
import 'dotenv/config'
import { errorHandler, notFound } from "./middlewares/errorHandler";
const app = express()

app.use(cors({ credentials: true }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(Logger("dev"))
app.use(cookieParser());

app.get("/", (req, res) => {
    res.send("hello");
    
})

app.use(notFound)
app.use(errorHandler)
const PORT = 3000

app.listen(PORT, () => {
    console.log(`App runing on Localhost :${PORT}`.red)
})