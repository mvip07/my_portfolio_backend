const crypto = require("crypto");
const Mailgen = require("mailgen");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const nodemailer = require("nodemailer");
const { ObjectId } = require("mongodb");
const Role = require("../models/role");

exports.sendEmailMessage = async (res, user, resObj, msgSub, retMsg) => {
	const config = {
		service: process.env.EMAIL_SERVICE,
		auth: {
			user: process.env.EMAIL_USER,
			pass: process.env.EMAIL_PASS,
		},
	};

	let transporter = nodemailer.createTransport(config);

	let MailGenerator = new Mailgen({
		theme: "cerberus",
		product: {
			link: "https://mailgen.js",
			name: "Euphoria E-commerce Company",
		},
	});

	let response = {
		body: {
			name: user.firstname + " " + user.lastname,
			subject: resObj.subject,
			intro: resObj.intro,
			action: {
				instructions: resObj.instructions,
				button: {
					color: resObj.color,
					text: resObj.text,
					link: resObj.link,
				},
			},
		},
	};

	let mail = MailGenerator.generate(response);

	let message = {
		html: mail,
		to: user.email,
		subject: msgSub,
		from: process.env.EMAIL_USER,
	};

	await transporter
		.sendMail(message)
		.then(() => {
			return res.status(200).json({ message: retMsg });
		})
		.catch((err) => res.status(500).json({ err }));
};

exports.login = async (req, res) => {
	const { email, password } = req.body;
	if (!email || !password)
		return res.status(400).json({ message: "Email and Password are required" });

	try {
		const user = await User.findOne({ email: email });

		if (!user)
			return res.status(401).json({ message: "The email or password you entered is invalid " });

		const passwordMatch = await bcrypt.compare(password, user.password);
		if (!passwordMatch)
			return res.status(401).json({ message: "The password you entered is invalid" });

		if (!user.isVerified)
			return res.status(401).json({ isVerified: "isNotVerified", message: "Confirm the verification code by entering these codes sent to your email" });

		if (user.block) {
			return res.status(403).json({ message: "Unfortunately, you have been blocked. Try contacting the admins" });
		}

		const token = jwt.sign(
			{
				userId: user._id,
				email: user.email,
				roles: user.roles,
			},
			process.env.JWT_SECRET,
			{
				expiresIn: "1h",
			}
		);

		return res.status(200).json({
			user: {
				token,
				roles: user.roles,
				userId: user._id,
				email: user.email,
			},
			message: "Login successful",
		});
	} catch (err) {
		return res.status(500).json({ message: err.message });
	}
};

exports.register = async (req, res) => {
	const { firstname, lastname, email, password } = req.body;

	try {
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res.status(409).json({ message: "User with this email already exists" });
		}

		const hashedPassword = await bcrypt.hash(password, 12);
		const verificationCode = crypto.randomInt(100000, 999999);
		const verificationExpiresAt = new Date(Date.now() + 3 * 60 * 1000);

		const newUser = new User({
			email,
			lastname,
			firstname,
			verificationCode,
			verificationExpiresAt,
			created_at: new Date(),
			password: hashedPassword,
		});

		await newUser.save();

		let resObj = {
			color: "#8A33FD",
			text: "Click to Countinue",
			link: "https://youtube.com",
			intro: "Welcome to the E-commerce Company",
			subject: `Your verification code is ${verificationCode}`,
			instructions: `Copy the given confirmation code and click continue. Expiration date: ${verificationExpiresAt} minutes <h1>${verificationCode}</h1>`,
		};
		this.sendEmailMessage(
			res,
			newUser,
			resObj,
			"Verification Code",
			"You have successfully registered. Verification code has been sent to your email"
		);

	} catch (err) {
		if (err.code === 11000) {
			return res.status(400).json({ message: "Email must be unique" });
		}
		res.status(500).json({ message: err.message });
	}
};

exports.sendVerificationCode = async (req, res) => {
	const { email } = req.body;

	if (!email) {
		return res.status(400).json({ message: "Email number is required" });
	}

	const verificationCode = crypto.randomInt(100000, 999999);
	const verificationExpiresAt = new Date(Date.now() + 3 * 60 * 1000);

	try {
		const user = await User.findOne({ email });

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		user.verificationCode = verificationCode;
		user.verificationExpiresAt = verificationExpiresAt;

		await user.save();

		let resObj = {
			color: "#8A33FD",
			text: "Click to Countinue",
			link: "https://youtube.com",
			intro: "Welcome to the E-commerce Company",
			subject: `Your verification code is ${verificationCode}`,
			instructions: `Copy the given confirmation code and click continue. Expiration date: ${verificationExpiresAt} minutes <h1>${verificationCode}</h1>`,
		};
		this.sendEmailMessage(
			res,
			user,
			resObj,
			"Verification Code",
			"Verification code has been sent to your email"
		);

	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

exports.confirmVerificationCode = async (req, res) => {
	const { email, inputVerificationCode } = req.body;

	if (!email || !inputVerificationCode) {
		return res.status(400).json({ message: "Email and verification code are required" });
	}

	try {
		const user = await User.findOne({ email: email });

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		if (user.verificationCode !== inputVerificationCode || new Date() > user.verificationExpiresAt) {
			return res.status(401).json({ message: "Invalid or expired verification code" });
		}

		user.isVerified = true;
		user.verificationCode = null;
		user.verificationExpiresAt = null;
		await user.save();

		return res.status(200).json({ message: "Verification successful" });
	} catch (err) {
		return res.status(500).json({ message: err.message });
	}
};

exports.forgotPassword = async (req, res) => {
	const { email } = req.body;

	if (!email) {
		return res.status(400).json({ message: "Email is required" });
	}

	try {
		const user = await User.findOne({ email: email });

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		const resetToken = crypto.randomBytes(32).toString("hex");
		const resetTokenExpiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1-hour expiration

		user.resetToken = resetToken;
		user.resetTokenExpiresAt = resetTokenExpiresAt;
		await user.save();

		const resetLink = `http://localhost:3000/new/password/${resetToken}`;


		let resObj = {
			subject: "Password Reset Request",
			intro: `You have requested a password reset. Click the link below to reset your password and it will expire in 1 hour: <br/> <br/> ${resetLink}.`,
			instructions: "You can update your password by pressing the button",
			color: "#8A33FD",
			text: "Reset Password",
			link: resetLink,
		};

		this.sendEmailMessage(
			res,
			user,
			resObj,
			"Reset Password",
			"Verification code has been sent to your email"
		);

	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

exports.resetPassword = async (req, res) => {
	const { token, password, confirmPassword } = req.body;

	if (!token || !password || !confirmPassword) {
		return res.status(400).json({ message: "Token and New Password or Confirm Passoword are required" });
	}

	try {
		const user = await User.findOne({ resetToken: token, resetTokenExpiresAt: { $gte: new Date() } });

		if (!user) {
			return res.status(400).json({ message: "Invalid or expired token" });
		}

		if (password !== confirmPassword) {
			return res.status(400).json({ message: "Password and Confirm Password did not match." })
		}

		const hashedPassword = await bcrypt.hash(password, 12);
		user.password = hashedPassword;
		user.resetToken = null;
		user.resetTokenExpiresAt = null;
		await user.save();

		return res.status(200).json({ message: "Password reset successfully" });
	} catch (err) {
		console.err("Error during password reset:", err);
		res.status(500).json({ message: err.message });
	}
};

exports.getUsers = async (req, res) => {
	try {
		const page = parseInt(req.query.page) || 1;
		const limit = parseInt(req.query.limit) || 10;
		const skip = (page - 1) * limit;

		const users = await User.find().skip(skip).limit(limit);

		let userList = users.map((i) => {
			return {
				id: i._id,
				lastname: i.lastname,
				firstname: i.firstname,
			};
		});

		if (!userList.length > 0) {
			return res.status(404).json({ message: "Page not found" })
		}

		return res.status(200).json({ userList });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

exports.getUserById = async (req, res) => {
	const { userId } = req.params;

	try {
		const user = await User.findById(userId);

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		const access = await Role.findById(user.roles).populate("permissions")

		let userModel = {
			id: user._id,
			roles: access,
			email: user.email,
			block: user.block,
			lastname: user.lastname,
			firstname: user.firstname,
			createdAt: user.createdAt,
			updatedAt: user.updatedAt,
			isVerified: user.isVerified,
		};

		res.status(200).json({ user: userModel });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

exports.updateUser = async (req, res) => {
	const { userId } = req.params;
	const { firstname, lastname } = req.body;

	if (!userId) {
		return res.status(400).json({ message: "User ID is required" });
	}

	try {
		const user = await User.findOne({ _id: new ObjectId(userId) });

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		user.firstname = firstname || user.firstname;
		user.lastname = lastname || user.lastname;
		await user.save();

		return res.status(200).json({ message: "User updated successfully" });
	} catch (err) {
		return res.status(500).json({ message: err.message });
	}
};

exports.updateUserForAdmin = async (req, res) => {
	const { userId } = req.params;
	const { firstname, lastname, email, password, roles, block } = req.body;

	try {
		if (!ObjectId.isValid(userId) || !ObjectId.isValid(roles)) {
			return res.status(400).json({ message: "Invalid user id or role id" });
		}

		const user = await User.findOne({ _id: new ObjectId(userId) });

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		user.firstname = firstname || user.firstname;
		user.lastname = lastname || user.lastname;
		user.email = email || user.email;

		if (password) {
			const bcrypt = require("bcryptjs");
			user.password = await bcrypt.hash(password, 12);
		}

		const role = await Role.findById(roles);

		if (!role) {
			return res.status(404).json({ message: "Role not found" });
		}
		user.roles = role;

		block === "true" ? user.block = block : block === "false" ? user.block = block : ""

		user.isVerified = false

		const verificationCode = crypto.randomInt(100000, 999999); // Example: "1a2b3c"
		const verificationExpiresAt = new Date(Date.now() + 3 * 60 * 1000); // Expires in 10 minutes

		user.verificationCode = verificationCode;
		user.verificationExpiresAt = verificationExpiresAt;

		await user.save();

		let resObj = {
			color: "#8A33FD",
			text: "Click to Countinue",
			link: "https://youtube.com",
			intro: "Welcome to the E-commerce Company",
			subject: `Your verification code is ${verificationCode}`,
			instructions: `Copy the given confirmation code and click continue. Expiration date: ${verificationExpiresAt} minutes. <h1>${verificationCode}</h1>`,
		};
		this.sendEmailMessage(
			res,
			user,
			resObj,
			"Verification Code",
			"Confirmation code sent successfully"
		);

		return res.status(200).json({ message: "User updated successfully" });
	} catch (err) {
		if (err.code === 11000) {
			return res.status(400).json({ message: "Email must be unique" })
		}
		return res.status(500).json({ message: err.message });
	}
};