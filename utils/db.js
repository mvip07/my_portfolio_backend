const mongodb = require("mongodb");
const mongoose = require("mongoose");
const MongoClient = mongodb.MongoClient;

let _db;

const options = {
    serverSelectionTimeoutMS: 15000, // Server selection timeout
    socketTimeoutMS: 20000, // Socket timeout
};
const mongoConnect = (callback) => {
    mongoose.connect(process.env.MONGOURL)
        .then((client) => {
            callback(client);
        })
        .catch((err) => console.error("Database connection error:", err));
}

const getDb = () => {
    if (_db) return _db;

    throw new Error("No Database Found!");
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
