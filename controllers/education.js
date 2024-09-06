const Education = require("../models/education");

exports.createEducation =  async (req, res) => {
    const { institution, degree, fieldOfStudy, where, startDate, endDate, description } = req.body;

    try {
        const education = new Education({ institution, degree, fieldOfStudy, where, startDate, endDate, description });
        await education.save();
        res.json({ message: 'Education record created successfully' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
}

exports.getEducation = async (req, res) => {
    try {
        const education = await Education.find({});
        res.json(education);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
}

exports.updateEducation = async (req, res) => {
    const { id } = req.params;
    const { institution, degree, where, fieldOfStudy, startDate, endDate, description } = req.body;

    try {
        let education = await Education.findById(id);
        if (!education) {
            return res.status(404).json({ message: 'Education record not found' });
        }

        education.institution = institution || education.institution;
        education.degree = degree || education.degree;
        education.where = where || education.where;
        education.fieldOfStudy = fieldOfStudy || education.fieldOfStudy;
        education.startDate = startDate || education.startDate;
        education.endDate = endDate || education.endDate;
        education.description = description || education.description;

        await education.save();
        res.json({ message: 'Education record updated successfully' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
}

exports.deleteEducation = async (req, res) => {
    const { id } = req.params;

    try {
        await Education.findByIdAndDelete(id);
        res.json({ message: 'Education record deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}