import express from "express";
import Logger from "morgan"
import cors from "cors"
import "colors"
import cookieParser from "cookie-parser"
import 'dotenv/config'
const app = express()

app.use(cors({ credentials: true }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(Logger("dev"))
app.use(cookieParser());
const PORT = 3000

app.listen(PORT, () => {
    console.log(`App runing on Localhost :${PORT}`.red)
})