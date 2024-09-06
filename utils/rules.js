const { check, validationResult } = require("express-validator");

exports.userRegister = [
	check("firstname")
		.notEmpty()
		.withMessage("Fist Name is required")
		.isAlpha()
		.withMessage("First name should contain only letters")
		.isLength({ min: 3, max: 50 })
		.withMessage("First name must be between 3 and 50 characters"),

	check("lastname")
		.notEmpty()
		.withMessage("Last Name is required")
		.isAlpha()
		.withMessage("Last name should contain only letters")
		.isLength({ min: 3, max: 50 })
		.withMessage("Last name must be between 3 and 50 characters"),

	check("email")
		.notEmpty()
		.withMessage("Email is required")
		.isEmail()
		.withMessage("Invalid email format"),

	check("password")
		.notEmpty()
		.withMessage("Password is required")
		.isLength({ min: 8, max: 16 })
		.withMessage("Password must be between 8 and 16 characters")
		.matches(
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#\$%\^&\*\(\)_\+\-=\[\]{};':"\\|,.<>/?])/
		)
		.withMessage(
			"Password must contain at least one uppercase, one lowercase, and one symbol"
		),
];

exports.userPassword = [
	check("password")
		.notEmpty()
		.withMessage("Password is required")
		.isLength({ min: 8, max: 16 })
		.withMessage("Password must be between 8 and 16 characters")
		.matches(
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#\$%\^&\*\(\)_\+\-=\[\]{};':"\\|,.<>/?])/
		)
		.withMessage(
			"Password must contain at least one uppercase, one lowercase, and one symbol"
		),
];

exports.userUpdate = [
	check("firstname")
		.isAlpha()
		.withMessage("First name should contain only letters")
		.isLength({ min: 3, max: 50 })
		.withMessage("First name must be between 3 and 50 characters"),

	check("lastname")
		.isAlpha()
		.withMessage("Last name should contain only letters")
		.isLength({ min: 3, max: 50 })
		.withMessage("Last name must be between 3 and 50 characters"),
];

exports.userUpdateForAdmin = [
	check("firstname")
		.isAlpha()
		.withMessage("First name should contain only letters")
		.isLength({ min: 3, max: 50 })
		.withMessage("First name must be between 3 and 50 characters"),

	check("lastname")
		.isAlpha()
		.withMessage("Last name should contain only letters")
		.isLength({ min: 3, max: 50 })
		.withMessage("Last name must be between 3 and 50 characters"),

	check("email")
		.isEmail()
		.withMessage("Invalid email format"),

	check("password")
		.isLength({ min: 8, max: 16 })
		.withMessage("Password must be between 8 and 16 characters")
		.matches(
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#\$%\^&\*\(\)_\+\-=\[\]{};':"\\|,.<>/?])/
		)
		.withMessage(
			"Password must contain at least one uppercase, one lowercase, and one symbol"
		),
];

exports.validate = (req, res, next) => {
	const err = validationResult(req);
	if (!err.isEmpty()) {
		return res.status(400).json({ message: err.array() });
	}
	next();
};


