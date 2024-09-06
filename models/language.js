const mongoose = require('mongoose');

const LanguageSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        minlength: [2, 'Title must be at least 2 characters long'],
        maxlength: [50, 'Title must be at most 50 characters long']
    },
    percentage: {
        type: Number,
        required: [true, 'Percentage is required'],
        min: [0, 'Percentage must be at least 0'],
        max: [100, 'Percentage must be at most 100']
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

const Language = mongoose.model('Language', LanguageSchema);

module.exports = Language;
