const authModel = require("../models/authModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { formidable } = require("formidable");
const cloudinary = require("cloudinary").v2;

class authController {
	login = async (req, res) => {
		const { email, password } = req.body;
		if (!email) {
			return res.status(404).json({ message: "Please provide your email" });
		}
		if (!password) {
			return res.status(404).json({ message: "Please provide your password" });
		}
		try {
			const user = await authModel.findOne({ email }).select("+password");
			if (user) {
				const match = await bcrypt.compare(password, user.password);
				if (match) {
					const obj = {
						id: user.id,
						name: user.name,
						role: user.role,
					};
					const token = await jwt.sign(obj, process.env.secret, {
						expiresIn: process.env.exp_time,
					});
					return res.status(200).json({ message: "Login Success", token });
				} else {
					return res.status(404).json({ message: "Invalid Password" });
				}
			} else {
				return res.status(404).json({ message: "User not found" });
			}
		} catch (error) {
			console.log(error);
		}
	};
	add_writer = async (req, res) => {
		// console.log(req.body);
		const { name, email, password } = req.body;
		if (!name) {
			res.status(404).json({ message: "Please provide name" });
		}
		if (!email) {
			res.status(404).json({ message: "Please provide email" });
		}
		if (!password) {
			res.status(404).json({ message: "Please provide password" });
		}
		try {
			const writer = await authModel.findOne({ email: email.trim() });
			if (writer) {
				res.status(404).json({ message: "Writer already exist" });
			} else {
				const new_writer = await authModel.create({
					name: name.trim(),
					email: email.trim(),
					password: await bcrypt.hash(password.trim(), 10),
					role: "writer",
				});
				return res
					.status(201)
					.json({ message: "Writer added successfully", writer: new_writer });
			}
		} catch (error) {
			return res.status(500).json({ message: "Internal server error" });
		}
	};
	get_writers = async (req, res) => {
		try {
			const writers = await authModel
				.find({ role: "writer" })
				.sort({ createdAt: -1 });
			return res.status(200).json({ writers });
		} catch (error) {
			return res.status(500).json({ message: "Internal server error" });
		}
	};
	getWriterById = async (req, res) => {
		const { id } = req.params;
		try {
			const writer = await authModel.findById(id);
			if (!writer) {
				return res.status(404).json({ message: "Writer not found" });
			} else {
				return res.status(200).json({ writer });
			}
		} catch (error) {
			return res.status(500).json({ message: "Internal server error" });
		}
	};
	update_writer = async (req, res) => {
		const { name, email, role } = req.body;
		const writerId = req.params.id;
		if (!name || !email) {
			return res.status(404).json({ message: "All fields are required" });
		}
		try {
			const writer = await authModel.findById(writerId);
			if (!writer) {
				return res.status(404).json({ message: "Writer not found" });
			}
			writer.name = name.trim();
			writer.email = email.trim();
			writer.role = role.trim();
			await writer.save();
			return res
				.status(200)
				.json({ message: "Writer updated successfully", writer });
		} catch (error) {
			return res.status(500).json({ message: "Internal server error" });
		}
	};
	delete_writer = async (req, res) => {
		const { id } = req.params;
		try {
			const writer = await authModel.findByIdAndDelete(id);
			if (!writer) {
				return res.status(404).json({ message: "Writer not found" });
			}
			return res.status(200).json({ message: "Writer deleted successfully" });
		} catch (error) {
			return res.status(500).json({ message: "Internal server error" });
		}
	};
	update_profile = async (req, res) => {
		const form = formidable({
			multiples: false,
			keepExtensions: true,
		});
		try {
			const [fields, files] = await form.parse(req);
			const name = fields.name?.[0]?.trim();
			const email = fields.email?.[0]?.trim();

			if (!name || !email) {
				return res.status(400).json({ message: "Name and Email is required" });
			}

			const user = await authModel.findById(req.params.id);
			if (!user) {
				return res.status(404).json({ message: "Profile not found" });
			}

			let imageUrl = "";
			if (files.image && files.image[0]) {
				cloudinary.config({
					cloud_name: process.env.cloudinary_cloud_name,
					api_key: process.env.cloudinary_api_key,
					api_secret: process.env.cloudinary_api_secret,
					secure: true,
				});
				const result = await cloudinary.uploader.upload(
					files.image[0].filepath,
					{ folder: "profile_images" }
				);
				imageUrl = result.secure_url;
			}
			user.name = name;
			user.email = email;
			user.image = imageUrl || user.image;
			await user.save();
			return res
				.status(200)
				.json({ message: "Profile updated successfully", user });
		} catch (error) {
			console.error("Profile Error:", error);
			return res.status(500).json({ message: "Something went wrong" });
		}
	};
	getProfileById = async (req, res) => {
		const { id } = req.params;
		try {
			const user = await authModel.findById(id);
			if (!user) {
				return res.status(404).json({ message: "Profile not found" });
			} else {
				return res.status(200).json({ user });
			}
		} catch (error) {
			return res.status(500).json({ message: "Internal server error" });
		}
	};
	changePassword = async (req, res) => {
		try {
			const { oldPassword, newPassword } = req.body;
			const userId = req.userInfo.id;

			const user = await authModel.findById(userId).select("+password");
			const isMatch = await bcrypt.compare(oldPassword, user.password);
			if (!isMatch) {
				return res.status(400).json({ message: "Old password is incorrect" });
			}
			const salt = await bcrypt.genSalt(10);
			const hashedPwd = await bcrypt.hash(newPassword, salt);
			user.password = hashedPwd;
			await user.save();
			return res.status(200).json({ message: "Password updated successfully" });
		} catch (error) {
			return res.status(500).json({ message: "Internal server error" });
		}
	};
}
module.exports = new authController();
