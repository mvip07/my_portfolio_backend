const mongoose = require('mongoose');

const WorkSchema = new mongoose.Schema({
    companyName: {
        type: String,
        required: true
    },
    degree: {
        type: String,
        required: true
    },
    where: {
        type: String,
        required: true
    },
    fieldOfWork: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
});

WorkSchema.pre("save", function (next) {
    this.updatedAt = Date.now();
    next();
});

const Work = mongoose.model('Work', WorkSchema);

module.exports = Work;
