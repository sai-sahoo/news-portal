import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { base_url } from "../../../../config/config";
import storeContext from "../../../../context/storeContext";

const AddEditCreative = () => {
	const { id } = useParams();
	const isEditMode = Boolean(id);
	const { store } = useContext(storeContext);
	const navigate = useNavigate();

	const [loader, setLoader] = useState(false);

	const [campaigns, setCampaigns] = useState([]);
	const [placements, setPlacements] = useState([]);

	const [campaign, setCampaign] = useState("");
	const [placement, setPlacement] = useState("");
	const [placementSize, setPlacementSize] = useState("");
	const [title, setTitle] = useState("");
	const [type, setType] = useState("image");
	const [clickUrl, setClickUrl] = useState("");
	const [weight, setWeight] = useState(1);
	const [status, setStatus] = useState("active");

	const [imageFile, setImageFile] = useState(null);
	const [previewImage, setPreviewImage] = useState("");
	const [htmlCode, setHtmlCode] = useState("");
	const [scriptCode, setScriptCode] = useState("");

	// Load campaigns & placements
	const loadFilters = async () => {
		try {
			const { data: cData } = await axios.get(
				`${base_url}/api/ads/campaigns`,
				{
					headers: { Authorization: `Bearer ${store.token}` },
					params: { limit: 100 },
				}
			);

			const { data: pData } = await axios.get(
				`${base_url}/api/ads/placements`,
				{
					headers: { Authorization: `Bearer ${store.token}` },
					params: { limit: 100 },
				}
			);

			setCampaigns(cData.campaigns.filter((c) => c.status === "active"));
			setPlacements(pData.placements.filter((p) => p.isActive));
            // console.log(campaigns);
            // console.log(placements);
		} catch {
			toast.error("Failed to load filters");
		}
	};

	// Load creative in edit mode
	const loadCreative = async () => {
		try {
			const { data } = await axios.get(
				`${base_url}/api/ads/creatives/${id}`,
				{ headers: { Authorization: `Bearer ${store.token}` } }
			);

			const c = data.creative;

			setCampaign(c.campaign?._id);
			setPlacement(c.placement?._id);
			setPlacementSize(c.size);
			setTitle(c.title);
			setType(c.type);
			setClickUrl(c.clickUrl || "");
			setWeight(c.weight);
			setStatus(c.status);
			setPreviewImage(c.imageUrl || "");
			setHtmlCode(c.htmlCode || "");
			setScriptCode(c.scriptCode || "");
		} catch {
			toast.error("Failed to load creative");
		}
	};

	useEffect(() => {
		loadFilters();
		if (isEditMode) loadCreative();
	}, [id]);

	const handlePlacementChange = (value) => {
		setPlacement(value);
		const selected = placements.find((p) => p._id === value);
		if (selected) setPlacementSize(selected.size);
	};

	const submit = async (e) => {
		e.preventDefault();
		setLoader(true);

		try {
			const formData = new FormData();

			formData.append("campaign", campaign);
			formData.append("placement", placement);
			formData.append("title", title);
			formData.append("type", type);
			formData.append("clickUrl", clickUrl);
			formData.append("weight", weight);
			formData.append("status", status);

			if (type === "image" && imageFile) {
				formData.append("image", imageFile);
			}

			if (type === "html") {
				formData.append("htmlCode", htmlCode);
			}

			if (type === "script") {
				formData.append("scriptCode", scriptCode);
			}

			if (isEditMode) {
				await axios.put(`${base_url}/api/ads/creatives/${id}`, formData, {
					headers: { Authorization: `Bearer ${store.token}` },
				});
			} else {
				await axios.post(`${base_url}/api/ads/creatives`, formData, {
					headers: { Authorization: `Bearer ${store.token}` },
				});
			}

			toast.success(isEditMode ? "Creative updated" : "Creative created");
			navigate("/dashboard/ads/creatives");
		} catch (error) {
			toast.error(error.response?.data?.message || "Error occurred");
		}

		setLoader(false);
	};

	return (
		<div className="min-h-screen bg-gray-100 p-8">
			<div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg border">
				{/* Header */}
				<div className="flex justify-between items-center px-8 py-6 border-b">
					<div>
						<h2 className="text-2xl font-semibold">
							{isEditMode ? "Edit Creative" : "Add Creative"}
						</h2>
						<p className="text-sm text-gray-500 mt-1">
							Create ad creative for campaign
						</p>
					</div>
					<Link
						to="/dashboard/ads/creatives"
						className="px-5 py-2 bg-gray-800 text-white rounded-md text-sm"
					>
						Creatives
					</Link>
				</div>

				<div className="px-8 py-8">
					<form onSubmit={submit} className="space-y-6">
						{/* Campaign */}
						<select
							required
							value={campaign}
							onChange={(e) => setCampaign(e.target.value)}
							className="w-full px-4 py-2 border rounded-md"
						>
							<option value="">Select Campaign</option>
							{campaigns.map((c) => (
								<option key={c._id} value={c._id}>
									{c.name}
								</option>
							))}
						</select>

						{/* Placement */}
						<select
							required
							value={placement}
							onChange={(e) => handlePlacementChange(e.target.value)}
							className="w-full px-4 py-2 border rounded-md"
						>
							<option value="">Select Placement</option>
							{placements.map((p) => (
								<option key={p._id} value={p._id}>
									{p.name} ({p.size})
								</option>
							))}
						</select>

						{placementSize && (
							<div className="text-sm text-gray-500">
								Placement Size: {placementSize}
							</div>
						)}

						{/* Title */}
						<input
							type="text"
							required
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							placeholder="Creative Title"
							className="w-full px-4 py-2 border rounded-md"
						/>

						{/* Type */}
						<select
							value={type}
							onChange={(e) => setType(e.target.value)}
							className="w-full px-4 py-2 border rounded-md"
						>
							<option value="image">Image</option>
							<option value="html">HTML</option>
							<option value="script">Script</option>
						</select>

						{/* Dynamic Fields */}
						{type === "image" && (
							<>
								<input
									type="file"
									accept="image/*"
									onChange={(e) => {
										setImageFile(e.target.files[0]);
										setPreviewImage(URL.createObjectURL(e.target.files[0]));
									}}
									className="w-full"
								/>

								{previewImage && (
									<img
										src={previewImage}
										alt="preview"
										className="w-48 mt-2 border"
									/>
								)}

								<input
									type="text"
									value={clickUrl}
									onChange={(e) => setClickUrl(e.target.value)}
									placeholder="Click URL"
									className="w-full px-4 py-2 border rounded-md"
								/>
							</>
						)}

						{type === "html" && (
							<textarea
								rows={6}
								value={htmlCode}
								onChange={(e) => setHtmlCode(e.target.value)}
								placeholder="Paste HTML Ad Code"
								className="w-full px-4 py-2 border rounded-md"
							/>
						)}

						{type === "script" && (
							<textarea
								rows={6}
								value={scriptCode}
								onChange={(e) => setScriptCode(e.target.value)}
								placeholder="Paste Script Code"
								className="w-full px-4 py-2 border rounded-md"
							/>
						)}

						{/* Weight */}
						<input
							type="number"
							value={weight}
							onChange={(e) => setWeight(e.target.value)}
							placeholder="Weight"
							className="w-full px-4 py-2 border rounded-md"
						/>

						{isEditMode && (
							<select
								value={status}
								onChange={(e) => setStatus(e.target.value)}
								className="w-full px-4 py-2 border rounded-md"
							>
								<option value="active">Active</option>
								<option value="paused">Paused</option>
							</select>
						)}

						<button className="px-6 py-3 bg-gray-800 text-white rounded-md">
							{loader
								? "Loading..."
								: isEditMode
								? "Update Creative"
								: "Save Creative"}
						</button>
					</form>
				</div>
			</div>
		</div>
	);
};

export default AddEditCreative;
