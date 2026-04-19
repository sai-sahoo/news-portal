import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { base_url } from "../../../../config/config";
import storeContext from "../../../../context/storeContext";

const AddEditPlacement = () => {
	const { id } = useParams();
	const isEditMode = Boolean(id);

	const { store } = useContext(storeContext);
	const navigate = useNavigate();

	const [loader, setLoader] = useState(false);

	const [name, setName] = useState("");
	const [code, setCode] = useState("");
	const [size, setSize] = useState("728x90");
	const [pageType, setPageType] = useState("homepage");
	const [description, setDescription] = useState("");
	const [isActive, setIsActive] = useState(true);

	// Load placement in edit mode
	useEffect(() => {
		if (isEditMode) {
			getPlacement();
		}
	}, [id]);

	const getPlacement = async () => {
		try {
			const { data } = await axios.get(
				`${base_url}/api/ads/placements/${id}`,
				{
					headers: {
						Authorization: `Bearer ${store.token}`,
					},
				}
			);

			const p = data.placement;

			setName(p.name);
			setCode(p.code);
			setSize(p.size);
			setPageType(p.pageType);
			setDescription(p.description || "");
			setIsActive(p.isActive);
		} catch (error) {
			toast.error("Failed to load placement");
		}
	};

	const submit = async (e) => {
		e.preventDefault();
		setLoader(true);

		try {
			const payload = {
				name,
				code: code.toLowerCase().trim(),
				size,
				pageType,
				description,
				isActive,
			};

			if (isEditMode) {
				await axios.put(`${base_url}/api/ads/placements/${id}`, payload, {
					headers: {
						Authorization: `Bearer ${store.token}`,
					},
				});
			} else {
				await axios.post(`${base_url}/api/ads/placements`, payload, {
					headers: {
						Authorization: `Bearer ${store.token}`,
					},
				});
			}

			toast.success(
				isEditMode
					? "Placement updated successfully"
					: "Placement created successfully"
			);

			navigate("/dashboard/ads/placements");
		} catch (error) {
			toast.error(error.response?.data?.message || "Something went wrong");
		}

		setLoader(false);
	};

	return (
		<div className="min-h-screen bg-gray-100 p-8">
			<div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg border border-gray-200">
				{/* Header */}
				<div className="flex justify-between items-center px-8 py-6 border-b border-gray-200">
					<div>
						<h2 className="text-2xl font-semibold text-gray-800">
							{isEditMode ? "Edit Placement" : "Add Placement"}
						</h2>
						<p className="text-sm text-gray-500 mt-1">
							{isEditMode
								? "Update placement inventory slot"
								: "Create a new ad inventory slot"}
						</p>
					</div>

					<Link
						to="/dashboard/ads/placements"
						className="px-5 py-2 bg-gray-800 text-white rounded-md hover:bg-black transition duration-300 text-sm"
					>
						Placements
					</Link>
				</div>

				<div className="px-8 py-8">
					<form onSubmit={submit} autoComplete="off" className="space-y-6">
						{/* Name */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Placement Name
							</label>
							<input
								type="text"
								required
								value={name}
								onChange={(e) => setName(e.target.value)}
								className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-gray-800 outline-none h-11"
								placeholder="Homepage Leaderboard"
							/>
						</div>

						{/* Code */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Placement Code
							</label>
							<input
								type="text"
								required
								value={code}
								onChange={(e) => setCode(e.target.value.replace(/\s+/g, "_"))}
								className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-gray-800 outline-none h-11"
								placeholder="homepage_leaderboard"
							/>
							<p className="text-xs text-gray-500 mt-1">
								Used in frontend API: /api/ads/serve/{code}
							</p>
						</div>

						{/* Size */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Ad Size
							</label>
							<select
								value={size}
								onChange={(e) => setSize(e.target.value)}
								className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-800 outline-none text-sm"
							>
								<option value="728x90">Leaderboard (728x90)</option>
								<option value="160x600">Skyscraper (160x600)</option>
								<option value="250x250">Square (250x250)</option>
								<option value="320x50">Mobile Banner (320x50)</option>
								<option value="320x480">Interstitial (320x480)</option>
								<option value="320x568">Full-screen Mobile (320x568)</option>
							</select>
						</div>

						{/* Page Type */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Page Type
							</label>
							<select
								value={pageType}
								onChange={(e) => setPageType(e.target.value)}
								className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-800 outline-none text-sm"
							>
								<option value="homepage">Homepage</option>
								<option value="article">Article</option>
								<option value="category">Category</option>
								<option value="mobile">Mobile</option>
							</select>
						</div>

						{/* Description */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Description (Optional)
							</label>
							<textarea
								rows="3"
								value={description}
								onChange={(e) => setDescription(e.target.value)}
								className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-gray-800 outline-none"
								placeholder="Appears above the fold on homepage"
							/>
						</div>

						{/* Status (Edit only) */}
						{isEditMode && (
							<div>
								<label className="block mb-2 text-sm font-medium">
									Active Status
								</label>
								<select
									value={isActive}
									onChange={(e) => setIsActive(e.target.value === "true")}
									className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-800 outline-none text-sm"
								>
									<option value={true}>Active</option>
									<option value={false}>Inactive</option>
								</select>
							</div>
						)}

						<button className="cursor-pointer px-6 py-3 bg-gray-800 text-white rounded-md">
							{loader
								? "Loading..."
								: isEditMode
								? "Update Placement"
								: "Save Placement"}
						</button>
					</form>
				</div>
			</div>
		</div>
	);
};

export default AddEditPlacement;
