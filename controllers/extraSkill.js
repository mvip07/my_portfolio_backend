const ExtraSkill = require('../models/extraSkill');

exports.createExtraSkill = async (req, res) => {
    const { title } = req.body;
    try {
        const newExtraSkill = new ExtraSkill({ title });
        await newExtraSkill.save();
        res.status(200).json({ message: "ExtraSkill created successfully" });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

exports.getExtraSkill = async (req, res) => {
    try {
        const extraSkill = await ExtraSkill.find();
        res.json(extraSkill);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

exports.updateExtraSkill = async (req, res) => {
    const { id } = req.params;
    const { title } = req.body;
    try {
        await ExtraSkill.findByIdAndUpdate(
            id,
            { title, updatedAt: Date.now() },
            { new: true, runValidators: true }
        );

        return res.status(201).json({ message: "ExtraSkill updated successfully" });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

exports.deleteExtraSkill = async (req, res) => {
    const { id } = req.params;
    try {
        await ExtraSkill.findByIdAndDelete(id);
        
        return res.status(201).json({ message: "ExtraSkill deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}