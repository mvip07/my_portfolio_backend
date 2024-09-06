const Visitor = require('../models/visitor');

exports.createVisitor = async (req, res) => {
    const { ip, location, block } = req.body;
    try {
        const ipAddress = await Visitor.findOne({ ip: ip });

        if (ipAddress) {
            return res.status(200).json({ message: "Already Created Visitor" })
        }

        const newVisitor = new Visitor({ ip, location, block });
        await newVisitor.save();
        return res.status(201).json({ message: "Succefully !!!" });


    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

exports.getVisitor = async (req, res) => {
    try {
        const visitors = await Visitor.find();
        return res.status(200).json(visitors);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

exports.bannedCountry = async (req, res) => {
    const { country_name } = req.body;

    try {
        if (!country_name) {
            return res.status(400).json({ message: 'Country name is required' });
        }

        const result = await Visitor.findOne({ "location.country_name": country_name });

        if (result && result.block) {
            return res.status(403).json({ banned: true, message: `Access to the territory of ${country_name} was successfully disabled` });
        } else {
            return res.status(200).json({ banned: false, message: `Your country has access. Access to the territory of ${country_name} is allowed` });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

exports.accessCountry = async (req, res) => {
    const { country_name, block } = req.body;
    try {
        if (!country_name) {
            return res.status(400).json({ message: 'Country name is required' });
        }

        const result = await Visitor.updateMany(
            { "location.country_name": country_name },
            { $set: { block: block } }
        );

        if (result.matchedCount > 0) {
            return res.status(200).json({
                message: block
                    ? `Access to the territory of ${country_name} was successfully disabled`
                    : `Successful access to the territory of ${country_name} was allowed`
            });
        } else {
            return res.status(404).json({ message: `No visitors found for the country ${country_name}` });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};


// exports.getVisitorByYears = async (req, res) => {
//     try {
//         const visitors = await Visitor.find();

//         const yearlyMonthlyCounts = {};

//         visitors.forEach(visitor => {
//             const date = new Date(visitor.createdAt);
//             const year = date.getUTCFullYear();
//             const month = date.getUTCMonth();

//             if (!yearlyMonthlyCounts[year]) {
//                 yearlyMonthlyCounts[year] = Array(12).fill(0);
//             }

//             yearlyMonthlyCounts[year][month]++;
//         });

//         const responseData = {
//             yearlyMonthlyCounts
//         };

//         res.status(200).json(responseData);

//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// }

// exports.getVisitorsCounter = async (req, res) => {
//     try {
//         const visitors = await Visitor.find();

//         const totalVisitor = {
//             year: 0,
//             month: 0,
//             today: 0,
//             total: visitors.length,
//         };

//         visitors.forEach(visitor => {
//             const date = new Date(visitor.createdAt);

//             if (new Date().getFullYear() === date.getUTCFullYear()) {
//                 totalVisitor["year"] += 1

//                 if (new Date().getMonth() === date.getUTCMonth()) {
//                     totalVisitor["month"] += 1
//                 }

//                 if (new Date().getDate() === date.getUTCDate()) {
//                     totalVisitor["today"] += 1
//                 }
//             }
//         });

//         res.status(200).json(totalVisitor);

//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// }

// exports.getVisitorsInCountry = async (req, res) => {
//     try {
//         const visitors = await Visitor.find();

//         const countryNames = [];
//         const formatDocument = [];

//         visitors.forEach((item, index) => {
//             const isCountryPresent = countryNames.some(countryObj => countryObj.name === item.location.country);

//             if (!isCountryPresent) {
//                 countryNames.push({ name: item.location.country, block: item.block });
//             }
//         });

//         for (const item of countryNames) {
//             const visitorsListLength = await Visitor.countDocuments({ 'location.country': item.name });

//             formatDocument.push({
//                 block: item.block,
//                 countryName: item.name,
//                 percentage: ((visitorsListLength / visitors.length) * 100).toFixed(2)
//             });
//         }

//         res.status(200).json(formatDocument);

//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// }

// exports.getVisitorsByDevice = async (req, res) => {
//     try {
//         const visitors = await Visitor.find();

//         const device = [];
//         const formatDocument = [];

//         visitors.forEach((item, index) => {
//             const isCountryPresent = device.some(countryObj => countryObj.device === item.location.device);

//             if (!isCountryPresent) {
//                 device.push({ device: item.location.device });
//             }
//         });

//         for (const item of device) {
//             const visitorsListLength = await Visitor.countDocuments({ 'location.device': item.device });

//             formatDocument.push({
//                 device: item.device,
//                 percentage: ((visitorsListLength / visitors.length) * 100).toFixed(2)
//             });
//         }

//         res.status(200).json(formatDocument);

//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// }

