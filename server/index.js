import express from "express";
import authRoutes from "./routes/auth.js";
import postRoutes from "./routes/posts.js";
import cookieParser from "cookie-parser";
import mongoose  from "mongoose";
import cors from "cors"
import dotenv from 'dotenv';
import {v2 as cloudinary } from 'cloudinary';

const app = express();
dotenv.config();

const port = process.env.PORT || "8800";
app.set("port", port);

app.use(cors())

//Middleware
app.use(express.json({ limit: '100mb' }));

// Increase payload size limit for URL-encoded requests
app.use(express.urlencoded({ limit: '100mb', extended: true }));

//static files 

//DATABASE connection
mongoose
  .connect(process.env.COSMOSDB_URL )
  .then(() => console.log("Connection to CosmosDB successful"))
  .catch((err) => console.error(err));
//Route middlewares
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.listen(port, ()=>console.log("Server Up and running"))
