import { useContext, useEffect, useState } from "react";
import { FaImage } from "react-icons/fa";
import axios from "axios";
import { base_url } from "../../config/config";
import storeContext from "../../context/storeContext";
import toast from "react-hot-toast";

const Profile = () => {
	const { store } = useContext(storeContext);
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [image, setImage] = useState(null);
	const [message, setMessage] = useState("");
	const [currentImage, setCurrentImage] = useState("");
	const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

	const [oldPassword, setOldPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [passwordError, setPasswordError] = useState("");
	const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

	useEffect(() => {
		const fetchProfile = async () => {
			try {
				const { data } = await axios.get(
					`${base_url}/api/profile/${store.userInfo.id}`,
					{
						headers: {
							Authorization: `Bearer ${store.token}`,
						},
					}
				);
				setName(data.user.name);
				setEmail(data.user.email);
				setCurrentImage(data.user.image);
			} catch (error) {
				setMessage(error?.response?.data?.message);
				toast.error(error?.response?.data?.message || "Failed to load profile");
			}
		};
		fetchProfile();
	}, [store.userInfo.id, store.token]);

	const handleFileChange = async (e) => {
		setImage(e.target.files[0]);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const formData = new FormData();
		formData.append("name", name);
		formData.append("email", email);
		if (image) {
			formData.append("image", image);
		}
		// console.log(Object.fromEntries(formData));
		// return;
		try {
			setIsUpdatingProfile(true);
			const { data } = await axios.put(
				`${base_url}/api/profile/update/${store.userInfo.id}`,
				formData,
				{
					headers: {
						Authorization: `Bearer ${store.token}`,
					},
				}
			);
			setMessage(data.message);
			toast.success(data.message);
			setCurrentImage(data.user.image);
		} catch (error) {
			setMessage(error.response.data.message);
			toast.error(error.response.data.message);
		} finally {
			setIsUpdatingProfile(false);
		}
	};

	const handlePwdChange = async (e) => {
		e.preventDefault();
		if (!oldPassword || !newPassword) {
			setPasswordError("Both password fields are required");
			return;
		}
		if (newPassword.length < 6) {
			setPasswordError("New password must be at least 6 char");
			return;
		}
		try {
			setIsUpdatingPassword(true);
			const { data } = await axios.post(
				`${base_url}/api/change-password`,
				{ oldPassword, newPassword },
				{
					headers: {
						Authorization: `Bearer ${store.token}`,
					},
				}
			);
			toast.success(data.message);
			setOldPassword("");
			setNewPassword("");
			setPasswordError("");
		} catch (error) {
			setMessage(error.response.data.message);
			toast.error(error.response.data.message);
		} finally {
			setIsUpdatingPassword(false);
		}
	};

	return (
		<div className="min-h-screen bg-gray-100 p-8">
			<div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
				{/* LEFT — Profile Info */}
				<div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8">
					<h2 className="text-2xl font-semibold text-gray-800 mb-6">
						Profile Information
					</h2>

					<div className="flex flex-col md:flex-row gap-8">
						{/* Image Upload */}
						<div className="flex-shrink-0">
							{currentImage ? (
								<>
									<img
										src={currentImage}
										alt="profile image"
										className="w-[150px] h-[150px] rounded-full object-cover"
									/>
									<input
										type="file"
										id="img"
										className="w-[160px] h-[50px] bg-gray-100 border border-dashed border-gray-700 text-gray-500 cursor-pointer hover:bg-gray-200 transition"
										onChange={handleFileChange}
									/>
								</>
							) : (
								<>
									<label
										htmlFor="img"
										className="w-[160px] h-[160px] flex flex-col justify-center items-center rounded-full bg-gray-100 border border-dashed border-gray-300 text-gray-500 cursor-pointer hover:bg-gray-200 transition"
									>
										<FaImage className="text-3xl mb-2" />
										<span className="text-sm">Upload Image</span>
									</label>
									<input
										type="file"
										id="img"
										className="hidden"
										onChange={handleFileChange}
									/>
								</>
							)}
						</div>

						{/* Form Fields */}
						<div className="flex-1 space-y-5">
							<div>
								<label className="block text-sm font-medium text-gray-600 mb-2">
									Name
								</label>
								<input
									value={name}
									onChange={(e) => setName(e.target.value)}
									type="text"
									placeholder="Enter your name"
									className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-800 outline-none h-11"
									required
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-600 mb-2">
									Email
								</label>
								<input
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									type="email"
									placeholder="Enter your email"
									className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-800 outline-none h-11"
									required
								/>
							</div>

							{/* <div>
								<label className="block text-sm font-medium text-gray-600 mb-2">
									Category
								</label>
								<div className="px-4 py-2 bg-gray-100 rounded-md text-gray-700 h-11 flex items-center">
									category
								</div>
							</div> */}
							<form onSubmit={handleSubmit}>
								<div className="pt-3">
									<button
										type="submit"
										disabled={isUpdatingProfile}
										className="cursor-pointer px-6 py-3 bg-gray-800 text-white rounded-md hover:bg-black transition font-medium"
									>
										{isUpdatingProfile ? "Updating..." : "Update Profile"}
									</button>
								</div>
							</form>
							{message && (
								<p className="text-sm text-center text-gray-500">{message}</p>
							)}
						</div>
					</div>
				</div>

				{/* RIGHT — Change Password */}
				<div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8">
					<h2 className="text-2xl font-semibold text-gray-800 mb-6">
						Change Password
					</h2>

					<form className="space-y-6" onSubmit={handlePwdChange}>
						<div>
							<label className="block text-sm font-medium text-gray-600 mb-2">
								Old Password
							</label>
							<input
								value={oldPassword}
								onChange={(e) => setOldPassword(e.target.value)}
								type="password"
								placeholder="Enter old password"
								className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-800 outline-none h-11"
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-600 mb-2">
								New Password
							</label>
							<input
								value={newPassword}
								onChange={(e) => setNewPassword(e.target.value)}
								type="password"
								placeholder="Enter new password"
								className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-800 outline-none h-11"
							/>
						</div>
						{passwordError && (
							<p className="text-sm text-center text-red-500">
								{passwordError}
							</p>
						)}
						<div>
							<button
								type="submit"
								disabled={isUpdatingPassword}
								className="cursor-pointer w-full px-6 py-3 bg-gray-800 text-white rounded-md hover:bg-black transition font-medium"
							>
								{isUpdatingPassword ? "Changing..." : "Change Password"}
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default Profile;
