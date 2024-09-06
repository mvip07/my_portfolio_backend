const Work = require("../models/work")
const About = require("../models/about")
const Skill = require("../models/skill")
const Project = require("../models/project")
const Language = require("../models/language")
const Category = require("../models/category")
const { Service } = require("../models/service")
const Education = require("../models/education")
const ExtraSkill = require("../models/extraSkill")
const SocialMedia = require("../models/socialMedia")

exports.mainPage = async (req, res) => {
    try {
        const work = await Work.find() || {}
        const skill = await Skill.find() || []
        const service = await Service.find() || []
        const about = await About.findOne({}) || []
        const language = await Language.find() || []
        const category = await Category.find() || []
        const education = await Education.find() || []
        const extraSkill = await ExtraSkill.find() || []
        const socialMedia = await SocialMedia.find() || []
        const project = (await Project.find()).reverse() || []

        return res.status(200).json({
            about, service, category, education, work, project, language, project, skill, extraSkill, socialMedia
        })
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}