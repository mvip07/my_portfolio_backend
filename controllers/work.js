const Work = require("../models/work");

exports.createWork = async (req, res) => {
    const { companyName, degree, where, fieldOfWork, startDate, endDate, description } = req.body;
    try {
        const work = new Work({ companyName, degree, where, fieldOfWork, startDate, endDate, description });

        await work.save();

        res.json({ message: 'Work record created successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

exports.getWork = async (req, res) => {
    try {
        const works = await Work.find();
        res.json(works);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

exports.updateWork = async (req, res) => {
    const { id } = req.params;
    const { companyName, degree, where, fieldOfWork, startDate, endDate, description } = req.body;
    try {
        const updatedWork = await Work.findByIdAndUpdate(
            id,
            {
                where,
                degree,
                endDate,
                startDate,
                description,
                fieldOfWork,
                companyName,
                updatedAt: Date.now()
            },
            { new: true }
        );
        res.json(updatedWork);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

exports.deleteWork = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedWork = await Work.findByIdAndDelete(id);
        res.json(deletedWork);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}
