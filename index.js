const cors = require('cors');
const path = require("path");
const multer = require("multer")
const express = require("express");
const bodyParser = require("body-parser");
const routerPath = require("./utils/routes");
const mongoConnect = require("./utils/db").mongoConnect

const app = express();
require("dotenv").config();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const corsOptions = {
    origin: ['http://localhost:3000', 'https://ozodov-mirabzal.vercel.app'], // Replace with your client's URL
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET, POST, PUT, PATCH, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    if (req.method === "OPTIONS") return res.sendStatus(200);

    next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(routerPath)

app.use((err, req, res, next) => {
    res.status(err.statusCode || 500).json({ message: err.message || "Internal server error" });
});

app.use((req, res, next) => {
    res.status(404).json({ message: "Route not found" });
});

mongoConnect(() => {
    app.listen(process.env.PORT || 8000, () => console.log("Server Starting..."))
})