const jwt = require("jsonwebtoken");
const Role = require("../models/role");
const User = require("../models/user");

exports.authenticate = (req, res, next) => {
	const authHeader = req.get("Authorization");
	if (!authHeader) {
		return res.status(401).json({ message: "Authorization header missing" });
	}

	const token = authHeader.split(" ")[1];
	if (!token) {
		return res.status(401).json({ message: "Token missing in Authorization header" });
	}

	try {
		const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

		if (!decodedToken) {
			return res.status(401).json({ message: "Not Authenticated" });
		}

		req.user = decodedToken;
		next();

	} catch (err) {
		if (err.name === "TokenExpiredError") {
			return res.status(401).json({ message: "Token has expired" });
		} else if (err.name === "JsonWebTokenError") {
			return res.status(401).json({ message: "Invalid token" });
		} else {
			return res.status(500).json({ message: "Internal server error" });
		}
	}
};

exports.checkRole = async (req, res, next) => {
	try {
		const userId = req.user.userId;
		if (!userId) {
			return res.status(403).json({ message: "User Id is required" });
		}

		const userRoleId = await User.findById(userId)		

		if (!userRoleId.roles[0]) {
			return res.status(403).json({ message: "Access forbidden: insufficient role" });
		}

		const role = await Role.findById(userRoleId.roles[0]).populate("permissions");
		if (!role) {
			return res.status(403).json({ message: "Access forbidden: role not found" });
		}

		const permissions = role.permissions || [];

		const requestPath = req.route.path;
		const hasPermission = permissions.some((permission) => permission.path === requestPath);

		if (hasPermission) { return next() };

		res.status(403).json({ message: "Access forbidden: insufficient role" });
	} catch (err) {
		console.log("Error checking role permissions:", err);
		return res.status(500).json({ message: err.message });
	}
};