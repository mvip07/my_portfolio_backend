const Visitor = require("../models/visitor");

exports.Dashboard = async (req, res) => {
    try {
        const visitors = await Visitor.find();

        const yearlyMonthlyCounts = {};
        const totalVisitor = {
            year: 0,
            month: 0,
            today: 0,
            total: visitors.length,
        };

        const countryCounts = {};
        const countryBlocks = {};
        const deviceCounts = {};

        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth();
        const currentDate = new Date().getDate();

        visitors.forEach(visitor => {
            const date = new Date(visitor.createdAt);
            const year = date.getUTCFullYear();
            const month = date.getUTCMonth();

            if (!yearlyMonthlyCounts[year]) {
                yearlyMonthlyCounts[year] = Array(12).fill(0);
            }
            yearlyMonthlyCounts[year][month]++;

            if (year === currentYear) {
                totalVisitor.year++;

                if (month === currentMonth) {
                    totalVisitor.month++;

                    if (date.getUTCDate() === currentDate) {
                        totalVisitor.today++;
                    }
                }
            }

            const country_name = visitor.location.country_name;
            const device = visitor.location.device;
            const block = visitor.block;

            if (country_name) {
                countryCounts[country_name] = (countryCounts[country_name] || 0) + 1;

                // Store block status for the country
                if (!(country_name in countryBlocks)) {
                    countryBlocks[country_name] = block;
                }
            }
            if (device) {
                deviceCounts[device] = (deviceCounts[device] || 0) + 1;
            }
        });

        const countryStats = Object.keys(countryCounts).map(country_name => ({
            country_name: country_name,
            percentage: ((countryCounts[country_name] / visitors.length) * 100).toFixed(2),
            block: countryBlocks[country_name]
        }));

        const deviceStats = Object.keys(deviceCounts).map(device => ({
            device: device,
            percentage: ((deviceCounts[device] / visitors.length) * 100).toFixed(2)
        }));

        const responseData = {
            yearlyMonthlyCounts,
            totalVisitor,
            countryStats,
            deviceStats
        };

        return res.status(200).json(responseData);

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};
