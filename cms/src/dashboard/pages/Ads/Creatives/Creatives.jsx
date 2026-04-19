import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { base_url } from "../../../../config/config";
import storeContext from "../../../../context/storeContext";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const Creatives = () => {
	const { store } = useContext(storeContext);

	const [creatives, setCreatives] = useState([]);
	const [campaigns, setCampaigns] = useState([]);
	const [placements, setPlacements] = useState([]);

	const [campaignFilter, setCampaignFilter] = useState("");
	const [placementFilter, setPlacementFilter] = useState("");
	const [statusFilter, setStatusFilter] = useState("");

	const [currentPage, setCurrentPage] = useState(1);
	const [limit, setLimit] = useState(10);
	const [totalPages, setTotalPages] = useState(1);

	const getFiltersData = async () => {
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

			setCampaigns(cData.campaigns || []);
			setPlacements(pData.placements || []);
		} catch {
			toast.error("Failed to load filters");
		}
	};

	const getCreatives = async () => {
		try {
			const { data } = await axios.get(`${base_url}/api/ads/creatives`, {
				headers: { Authorization: `Bearer ${store.token}` },
				params: {
					page: currentPage,
					limit,
					campaign: campaignFilter,
					placement: placementFilter,
					status: statusFilter,
				},
			});

			setCreatives(data.creatives);
			setTotalPages(data.totalPages);
		} catch {
			toast.error("Failed to load creatives");
		}
	};

	useEffect(() => {
		getFiltersData();
	}, []);

	useEffect(() => {
		getCreatives();
	}, [campaignFilter, placementFilter, statusFilter, currentPage, limit]);

	const toggleStatus = async (id) => {
		try {
			await axios.patch(
				`${base_url}/api/ads/creatives/${id}/toggle`,
				{},
				{ headers: { Authorization: `Bearer ${store.token}` } }
			);
			getCreatives();
		} catch {
			toast.error("Failed to update status");
		}
	};

	const deleteCreative = async (id) => {
		if (!window.confirm("Delete this creative?")) return;

		try {
			await axios.delete(`${base_url}/api/ads/creatives/${id}`, {
				headers: { Authorization: `Bearer ${store.token}` },
			});
			getCreatives();
		} catch {
			toast.error("Delete failed");
		}
	};

	const calculateCTR = (clicks, impressions) => {
		if (!impressions) return "0%";
		return ((clicks / impressions) * 100).toFixed(2) + "%";
	};

	return (
		<div className="min-h-screen bg-gray-100 p-8">
			<div className="max-w-7xl mx-auto bg-white border rounded-lg shadow-sm">
				{/* Header */}
				<div className="flex justify-between items-center px-8 py-6 border-b">
					<div>
						<h2 className="text-2xl font-semibold">Creatives</h2>
						<p className="text-sm text-gray-500">Manage Ad Creatives</p>
					</div>
					<Link
						to="/dashboard/ad/creative/add"
						className="px-5 py-2 bg-gray-800 text-white rounded-md text-sm"
					>
						+ Add Creative
					</Link>
				</div>

				{/* Filters */}
				<div className="px-8 py-6 border-b flex gap-4 flex-wrap">
					<select
						value={campaignFilter}
						onChange={(e) => {
							setCampaignFilter(e.target.value);
							setCurrentPage(1);
						}}
						className="px-4 py-2 border rounded-md"
					>
						<option value="">All Campaigns</option>
						{campaigns.map((c) => (
							<option key={c._id} value={c._id}>
								{c.name}
							</option>
						))}
					</select>

					<select
						value={placementFilter}
						onChange={(e) => {
							setPlacementFilter(e.target.value);
							setCurrentPage(1);
						}}
						className="px-4 py-2 border rounded-md"
					>
						<option value="">All Placements</option>
						{placements.map((p) => (
							<option key={p._id} value={p._id}>
								{p.name}
							</option>
						))}
					</select>

					<select
						value={statusFilter}
						onChange={(e) => {
							setStatusFilter(e.target.value);
							setCurrentPage(1);
						}}
						className="px-4 py-2 border rounded-md"
					>
						<option value="">All Status</option>
						<option value="active">Active</option>
						<option value="paused">Paused</option>
					</select>
				</div>

				{/* Table */}
				<div className="overflow-x-auto">
					<table className="w-full text-sm">
						<thead className="bg-gray-50 text-xs uppercase">
							<tr>
								<th className="px-6 py-4 text-left">No</th>
								<th className="px-6 py-4 text-left">Title</th>
								<th className="px-6 py-4 text-left">Campaign</th>
								<th className="px-6 py-4 text-left">Placement</th>
								<th className="px-6 py-4 text-left">Type</th>
								<th className="px-6 py-4 text-left">Impressions</th>
								<th className="px-6 py-4 text-left">Clicks</th>
								<th className="px-6 py-4 text-left">CTR</th>
								<th className="px-6 py-4 text-left">Weight</th>
								<th className="px-6 py-4 text-left">Status</th>
								<th className="px-6 py-4 text-left">Action</th>
							</tr>
						</thead>
						<tbody>
							{creatives.map((c, index) => (
								<tr key={c._id} className="border-t">
									<td className="px-6 py-4">{index + 1}</td>
									<td className="px-6 py-4">{c.title}</td>
									<td className="px-6 py-4">{c.campaign?.name}</td>
									<td className="px-6 py-4">
										{c.placement?.name} ({c.placement?.size})
									</td>
									<td className="px-6 py-4">{c.type}</td>
									<td className="px-6 py-4">{c.impressions}</td>
									<td className="px-6 py-4">{c.clicks}</td>
									<td className="px-6 py-4">
										{calculateCTR(c.clicks, c.impressions)}
									</td>
									<td className="px-6 py-4">{c.weight}</td>
									<td className="px-6 py-4">
										<button
											onClick={() => toggleStatus(c._id)}
											className={`px-3 py-1 rounded-full text-xs ${
												c.status === "active"
													? "bg-green-200 text-green-700"
													: "bg-gray-200 text-gray-700"
											}`}
										>
											{c.status}
										</button>
									</td>
									<td className="px-6 py-4 flex gap-3">
										<Link
											to={`/dashboard/ad/creative/edit/${c._id}`}
											className="p-2 bg-gray-800 text-white rounded"
										>
											<FaEdit size={14} />
										</Link>

										<button
											onClick={() => deleteCreative(c._id)}
											className="p-2 bg-red-600 text-white rounded"
										>
											<FaTrashAlt size={14} />
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
};

export default Creatives;
