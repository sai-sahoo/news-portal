import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { base_url } from "../../../../config/config";
import storeContext from "../../../../context/storeContext";

const AddEditCampaign = () => {
	const { id } = useParams();
	const isEditMode = Boolean(id);

	const { store } = useContext(storeContext);
	const navigate = useNavigate();

	const [loader, setLoader] = useState(false);
	const [advertisers, setAdvertisers] = useState([]);

	const [advertiser, setAdvertiser] = useState("");
	const [name, setName] = useState("");
	const [pricingModel, setPricingModel] = useState("CPM");
	const [rate, setRate] = useState("");
	const [budget, setBudget] = useState("");
	const [dailyBudget, setDailyBudget] = useState("");
	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");
	const [status, setStatus] = useState("draft");

	// Load advertisers
	const getAdvertisers = async () => {
		try {
			const { data } = await axios.get(`${base_url}/api/ads/advertisers`, {
				headers: { Authorization: `Bearer ${store.token}` },
				params: { limit: 100 },
			});

			const activeAdvertisers = data.advertisers.filter(
				(a) => a.status === "active"
			);

			setAdvertisers(activeAdvertisers);
		} catch {
			toast.error("Failed to load advertisers");
		}
	};

	// Load campaign in edit mode
	const getCampaign = async () => {
		try {
			const { data } = await axios.get(
				`${base_url}/api/ads/campaigns/${id}`,
				{
					headers: { Authorization: `Bearer ${store.token}` },
				}
			);

			const c = data.campaign;

			setAdvertiser(c.advertiser?._id);
			setName(c.name);
			setPricingModel(c.pricingModel);
			setRate(c.rate);
			setBudget(c.budget);
			setDailyBudget(c.dailyBudget || "");
			setStartDate(c.startDate?.substring(0, 10));
			setEndDate(c.endDate?.substring(0, 10));
			setStatus(c.status);
		} catch {
			toast.error("Failed to load campaign");
		}
	};

	useEffect(() => {
		getAdvertisers();
		if (isEditMode) getCampaign();
	}, [id]);

	const validateForm = () => {
		if (!advertiser) {
			toast.error("Select advertiser");
			return false;
		}

		if (new Date(endDate) <= new Date(startDate)) {
			toast.error("End date must be after start date");
			return false;
		}

		if (Number(budget) <= 0) {
			toast.error("Budget must be greater than 0");
			return false;
		}

		return true;
	};

	const submit = async (e) => {
		e.preventDefault();
		if (!validateForm()) return;

		setLoader(true);

		try {
			const payload = {
				advertiser,
				name,
				pricingModel,
				rate: Number(rate),
				budget: Number(budget),
				dailyBudget: dailyBudget ? Number(dailyBudget) : null,
				startDate,
				endDate,
				status,
			};

			if (isEditMode) {
				await axios.put(`${base_url}/api/ads/campaigns/${id}`, payload, {
					headers: { Authorization: `Bearer ${store.token}` },
				});
			} else {
				await axios.post(`${base_url}/api/ads/campaigns`, payload, {
					headers: { Authorization: `Bearer ${store.token}` },
				});
			}

			toast.success(
				isEditMode
					? "Campaign updated successfully"
					: "Campaign created successfully"
			);

			navigate("/dashboard/ads/campaigns");
		} catch (error) {
			toast.error(error.response?.data?.message || "Something went wrong");
		}

		setLoader(false);
	};

	const getRateLabel = () => {
		if (pricingModel === "CPM") return "Rate (Cost per 1000 impressions)";
		if (pricingModel === "CPC") return "Rate (Cost per click)";
		return "Flat Amount";
	};

	return (
		<div className="min-h-screen bg-gray-100 p-8">
			<div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg border border-gray-200">
				{/* Header */}
				<div className="flex justify-between items-center px-8 py-6 border-b">
					<div>
						<h2 className="text-2xl font-semibold">
							{isEditMode ? "Edit Campaign" : "Add Campaign"}
						</h2>
						<p className="text-sm text-gray-500 mt-1">
							Manage campaign budget & pricing
						</p>
					</div>

					<Link
						to="/dashboard/ads/campaigns"
						className="px-5 py-2 bg-gray-800 text-white rounded-md text-sm"
					>
						Campaigns
					</Link>
				</div>

				<div className="px-8 py-8">
					<form onSubmit={submit} className="space-y-6">
						{/* Advertiser */}
						<select
							required
							value={advertiser}
							onChange={(e) => setAdvertiser(e.target.value)}
							className="w-full px-4 py-2 border rounded-lg"
						>
							<option value="">Select Advertiser</option>
							{advertisers.map((a) => (
								<option key={a._id} value={a._id}>
									{a.name}
								</option>
							))}
						</select>

						{/* Campaign Name */}
						<input
							type="text"
							required
							value={name}
							onChange={(e) => setName(e.target.value)}
							placeholder="Campaign Name"
							className="w-full px-4 py-2 border rounded-md h-11"
						/>

						{/* Pricing Model */}
						<select
							value={pricingModel}
							onChange={(e) => setPricingModel(e.target.value)}
							className="w-full px-4 py-2 border rounded-lg"
						>
							<option value="CPM">CPM</option>
							<option value="CPC">CPC</option>
							<option value="Flat">Flat</option>
						</select>

						{/* Rate */}
						<input
							type="number"
							required
							value={rate}
							onChange={(e) => setRate(e.target.value)}
							placeholder={getRateLabel()}
							className="w-full px-4 py-2 border rounded-md h-11"
						/>

						{/* Budget */}
						<input
							type="number"
							required
							value={budget}
							onChange={(e) => setBudget(e.target.value)}
							placeholder="Total Budget"
							className="w-full px-4 py-2 border rounded-md h-11"
						/>

						{/* Daily Budget */}
						<input
							type="number"
							value={dailyBudget}
							onChange={(e) => setDailyBudget(e.target.value)}
							placeholder="Daily Budget (optional)"
							className="w-full px-4 py-2 border rounded-md h-11"
						/>

						{/* Dates */}
						<div className="flex gap-4">
							<input
								type="date"
								required
								value={startDate}
								onChange={(e) => setStartDate(e.target.value)}
								className="flex-1 px-4 py-2 border rounded-md"
							/>
							<input
								type="date"
								required
								value={endDate}
								onChange={(e) => setEndDate(e.target.value)}
								className="flex-1 px-4 py-2 border rounded-md"
							/>
						</div>

						{/* Status (edit only) */}
						{isEditMode && (
							<select
								value={status}
								onChange={(e) => setStatus(e.target.value)}
								className="w-full px-4 py-2 border rounded-lg"
							>
								<option value="draft">Draft</option>
								<option value="active">Active</option>
								<option value="paused">Paused</option>
								<option value="completed">Completed</option>
							</select>
						)}

						<button className="px-6 py-3 bg-gray-800 text-white rounded-md">
							{loader
								? "Loading..."
								: isEditMode
								? "Update Campaign"
								: "Save Campaign"}
						</button>
					</form>
				</div>
			</div>
		</div>
	);
};

export default AddEditCampaign;
