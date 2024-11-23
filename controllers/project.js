const fs = require('fs');
const Project = require('../models/project');
const Category = require('../models/category');
const Technology = require('../models/technology');
const uploadToFirebase = require('../utils/firebaseUpload');

exports.createProject = async (req, res) => {
    const { title, description, serverLink, githubLink, category, technology } = req.body;
    let image = ''

    try {
        if (req.file) {
            if (req.file) {
                image = await uploadToFirebase(req.file.buffer, `images/${Date.now()}-${req.file.originalname}`, req.file.mimetype);
            }
        }

        const newProject = new Project({ title, image, description, serverLink, githubLink, category, technology });
        await newProject.save();

        res.status(200).json({ message: "You have created a successful Project" });
    } catch (err) {        
        res.status(500).json({ message: err.message });
    }
}

exports.getProject = async (req, res) => {
    try {
        const projects = await Project.find();

        return res.status(200).json(projects);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

exports.updateProject = async (req, res) => {
    const { id } = req.params;
    const { title, description, serverLink, githubLink, category, technology } = req.body;
    let image = '';

    try {
        if (req.file) {
            const imageFilePath = req.file.path;
            image = await uploadToFirebase(imageFilePath, `images/${req.file?.filename}`, req.file?.mimetype);
            fs.unlinkSync(imageFilePath); // Delete file from local system
        }

        let project = await Project.findById(id);

        if (!project) {
            return res.status(404).json({ message: 'Project data not found' });
        }

        if (!image) image = project.image

        await Project.findByIdAndUpdate(
            id, { title, image, description, serverLink, githubLink, category, technology, updatedAt: Date.now() }, { new: true }
        );
        res.status(201).json({ message: "You have updated a successful Project" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

exports.deleteProject = async (req, res) => {
    const { id } = req.params;
    try {
        await Project.findByIdAndDelete(id);
        res.status(200).json({ message: "You have deleted a successful Project" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

exports.getAllProject = async (req, res) => {
    try {
        const categories = await Category.find();
        const technologies = await Technology.find();

        const projects = await Project.find();

        const updatedProjects = projects.map(project => {
            const projectCategories = project.category.map(id =>
                categories.find(category => category._id.equals(id))
            );

            const projectTechnologies = project.technology.map(id =>
                technologies.find(tech => tech._id.equals(id))
            );

            return {
                ...project.toObject(),
                category: projectCategories,
                technology: projectTechnologies
            };
        });

        return res.status(200).json({
            projects: updatedProjects,
            categories: categories,
            technologies: technologies
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
