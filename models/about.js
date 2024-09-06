const mongoose = require("mongoose");

const aboutSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    profession: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    contact: {
        email: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            required: true
        }
    },
    image: {
        type: String,
        required: true
    },
    cv: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

aboutSchema.pre("save", function (next) {
    this.updatedAt = Date.now();
    next();
});

const About = mongoose.model('About', aboutSchema);

module.exports = About