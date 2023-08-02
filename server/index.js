import express from "express";
import authRoutes from "./routes/auth.js";
import postRoutes from "./routes/posts.js";
import cookieParser from "cookie-parser";
import mongoose  from "mongoose";
import cors from "cors"
import dotenv from 'dotenv';
import multer from "multer";
import path from "path";
const app = express();
dotenv.config();

const port = process.env.PORT || "8800";
app.set("port", port);

app.use(cors())

//Middleware
app.use(express.json({ limit: '100mb' }));

// Increase payload size limit for URL-encoded requests
app.use(express.urlencoded({ limit: '100mb', extended: true }));

//DATABASE connection
mongoose
  .connect(process.env.COSMOSDB_URL )
  .then(() => console.log("Connection to CosmosDB successful"))
  .catch((err) => console.error(err));
//Route middlewares
app.use(express.json());
app.use(cookieParser());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Use an absolute path for the destination directory
    cb(null, path.join(__dirname, "public", "upload"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const upload = multer({ storage });

app.post("/api/upload", upload.single("file"), function (req, res) {
  const file = req.file;
  res.status(200).json(file.filename);
});

// Serve uploaded files as static files
app.use('/uploaded', express.static(path.join(__dirname, "public", "upload")));
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);

app.listen(port, ()=>console.log("Server Up and running"))
