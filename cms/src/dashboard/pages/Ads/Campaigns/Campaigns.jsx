import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { base_url } from "../../../../config/config";
import storeContext from "../../../../context/storeContext";
import { FaEdit, FaTrashAlt } from "react-icons/fa";

const Campaigns = () => {
	const { store } = useContext(storeContext);

	const [campaigns, setCampaigns] = useState([]);
	const [advertisers, setAdvertisers] = useState([]);
	const [statusFilter, setStatusFilter] = useState("");
	const [advertiserFilter, setAdvertiserFilter] = useState("");
	const [page, setPage] = useState(1);

	const getCampaigns = async () => {
		try {
			const { data } = await axios.get(`${base_url}/api/ads/campaigns`, {
				headers: { Authorization: `Bearer ${store.token}` },
				params: {
					status: statusFilter,
					advertiser: advertiserFilter,
					page,
					limit: 5,
				},
			});

			setCampaigns(data.campaigns);
		} catch {
			toast.error("Failed to load campaigns");
		}
	};

	const getAdvertisers = async () => {
		try {
			const { data } = await axios.get(`${base_url}/api/ads/advertisers`, {
				headers: { Authorization: `Bearer ${store.token}` },
			});
			setAdvertisers(data.advertisers);
		} catch {}
	};

	useEffect(() => {
		getCampaigns();
		getAdvertisers();
	}, [statusFilter, advertiserFilter, page]);

	const markCompleted = async (id) => {
		try {
			await axios.put(
				`${base_url}/api/ads/campaigns/${id}`,
				{ status: "completed" },
				{ headers: { Authorization: `Bearer ${store.token}` } }
			);
			toast.success("Campaign marked as completed");
			getCampaigns();
		} catch {
			toast.error("Update failed");
		}
	};

	return (
		<div className="min-h-screen bg-gray-100 p-8">
			<div className="max-w-7xl mx-auto bg-white border rounded-lg shadow-sm">
				{/* Header */}
				<div className="flex justify-between items-center px-8 py-6 border-b">
					<div>
						<h2 className="text-2xl font-semibold">Campaigns</h2>
						<p className="text-sm text-gray-500">Manage Campaign Revenue</p>
					</div>

					<Link
						to="/dashboard/ad/campaign/add"
						className="px-5 py-2 bg-gray-800 text-white rounded-md text-sm"
					>
						+ Add Campaign
					</Link>
				</div>

				{/* Filters */}
				<div className="flex gap-6 px-8 py-6 border-b">
					<select
						value={statusFilter}
						onChange={(e) => setStatusFilter(e.target.value)}
						className="px-4 py-2 border rounded-lg"
					>
						<option value="">All Status</option>
						<option value="active">Active</option>
						<option value="paused">Paused</option>
						<option value="completed">Completed</option>
						<option value="draft">Draft</option>
					</select>

					<select
						value={advertiserFilter}
						onChange={(e) => setAdvertiserFilter(e.target.value)}
						className="px-4 py-2 border rounded-lg"
					>
						<option value="">All Advertisers</option>
						{advertisers.map((a) => (
							<option key={a._id} value={a._id}>
								{a.name}
							</option>
						))}
					</select>
				</div>

				{/* Table */}
				<div className="overflow-x-auto">
					<table className="w-full text-sm">
						<thead className="bg-gray-50 text-xs uppercase">
							<tr>
								<th className="py-4 px-8 text-left">Campaign</th>
								<th className="py-4 px-8 text-left">Advertiser</th>
								<th className="py-4 px-8 text-left">Pricing</th>
								<th className="py-4 px-8 text-left">Budget</th>
								<th className="py-4 px-8 text-left">Spent</th>
								<th className="py-4 px-8 text-left">Status</th>
								<th className="py-4 px-8 text-left">Action</th>
							</tr>
						</thead>

						<tbody>
							{campaigns.map((c) => {
								const progress = ((c.spent / c.budget) * 100).toFixed(1);

								return (
									<tr key={c._id} className="border-t">
										<td className="py-4 px-8">{c.name}</td>
										<td className="py-4 px-8">{c.advertiser?.name}</td>
										<td className="py-4 px-8">
											{c.pricingModel} @ {c.rate}
										</td>
										<td className="py-4 px-8">₹{c.budget}</td>
										<td className="py-4 px-8">
											₹{c.spent}
											<div className="w-full bg-gray-200 h-2 mt-1 rounded">
												<div
													className="bg-gray-800 h-2 rounded"
													style={{ width: `${progress}%` }}
												></div>
											</div>
										</td>
										<td className="py-4 px-8">
											<span className="px-3 py-1 text-xs rounded-full bg-gray-200">
												{c.status}
											</span>
										</td>
										<td className="py-4 px-8 flex gap-3">
											<Link
												to={`/dashboard/ad/campaign/edit/${c._id}`}
												className="p-2 bg-gray-800 text-white rounded"
											>
												<FaEdit size={14} />
											</Link>

											{c.status !== "completed" && (
												<button
													onClick={() => markCompleted(c._id)}
													className="px-3 py-1 bg-blue-600 text-white text-xs rounded"
												>
													Complete
												</button>
											)}

											<FaTrashAlt
												className="cursor-pointer text-red-600 mt-2"
												onClick={() => {}}
											/>
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
};

export default Campaigns;
