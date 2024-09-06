const mongoose = require('mongoose');

const ExtraSkillSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        minlength: [2, 'Title must be at least 2 characters long'],
        maxlength: [50, 'Title must be at most 50 characters long']
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

const ExtraSkill = mongoose.model('ExtraSkill', ExtraSkillSchema);

module.exports = ExtraSkill;
