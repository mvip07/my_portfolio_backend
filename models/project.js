const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    serverLink: {
        type: String,
        required: true
    },
    githubLink: {
        type: String,
        required: true
    },
    category: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: true
        },
    ],
    technology: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Technology",
            required: true
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
});

ProjectSchema.pre("save", function (next) {
    this.updatedAt = Date.now();
    next();
});

const Project = mongoose.model('Project', ProjectSchema);

module.exports = Project;
