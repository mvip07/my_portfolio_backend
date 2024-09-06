const Skill = require('../models/skill');

exports.createSkill = async (req, res) => {
    const { title, percentage } = req.body;
    try {
        const newSkill = new Skill({ title, percentage });
        await newSkill.save();
        res.status(200).json({ message: "Skill created successfully" });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

exports.getSkill = async (req, res) => {
    try {
        const skill = await Skill.find();
        res.json(skill);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

exports.updateSkill = async (req, res) => {
    const { id } = req.params;
    const { title, percentage } = req.body;
    try {
        await Skill.findByIdAndUpdate(
            id,
            { title, percentage, updatedAt: Date.now() },
            { new: true, runValidators: true }
        );

        return res.status(201).json({ message: "Skill updated successfully" });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

exports.deleteSkill = async (req, res) => {
    const { id } = req.params;
    try {
        await Skill.findByIdAndDelete(id);
        return res.status(201).json({ message: "Skill deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}