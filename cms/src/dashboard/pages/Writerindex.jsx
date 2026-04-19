import { useState, useEffect, useContext } from "react";
import axios from "axios"; 
import { Link } from "react-router-dom";
import storeContext from "../../context/storeContext";
import { base_url } from "../../config/config";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import profile from "../../assets/profile.png";

const Adminindex = () => {
	const { store } = useContext(storeContext);
	// 1. State for Filters
	const [contentLang, setContentLang] = useState("en");
	const [duration, setDuration] = useState("Last 7 days");

	// 2. State for Data
	const [stats, setStats] = useState({
		totalNews: 0,
		published: 0,
		pending: 0,
		draft: 0,
		rejected: 0,
	});
	const [loading, setLoading] = useState(true);

	// 3. Fetch Data Logic
	const fetchStats = async () => {
		try {
			setLoading(true);
			const response = await axios.get(`${base_url}/api/dashboard/newsCount`, {
				headers: {
					Authorization: `Bearer ${store.token}`,
				},
				params: { contentLang, duration },
			});
			if (response.data.success) {
				setStats(response.data.data);
			}
		} catch (error) {
			console.error("Error fetching dashboard stats", error);
		} finally {
			setLoading(false);
		}
	};

	// Trigger fetch on filter change
	useEffect(() => {
		fetchStats();
	}, [contentLang, duration]);

	// Define Cards Mapping
	const statCards = [
		{ title: "Total News", value: stats.totalNews, color: "text-blue-600" },
		{ title: "Pending News", value: stats.pending, color: "text-orange-500" },
		{
			title: "Published News",
			value: stats.published,
			color: "text-green-600",
		},
		// { title: "Drafts", value: stats.draft, color: "text-gray-600" },
		// { title: "Rejected", value: stats.rejected, color: "text-red-600" },
	];

	return (
		<div className="min-h-screen bg-gray-50 p-8">
			{/* ===== Filter Header ===== */}
			<div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
				<h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>

				<div className="flex gap-4">
					{/* Language Dropdown */}
					<select
						value={contentLang}
						onChange={(e) => setContentLang(e.target.value)}
						className="bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
					>
						<option value="en">English</option>
						<option value="hi">Hindi</option>
						<option value="od">Odia</option>
					</select>

					{/* Duration Dropdown */}
					<select
						value={duration}
						onChange={(e) => setDuration(e.target.value)}
						className="bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
					>
						<option value="Today">Today</option>
						<option value="Last 7 days">Last 7 days</option>
						<option value="Last 30 days">Last 30 days</option>
						<option value="All">All Time</option>
					</select>
				</div>
			</div>

			{/* ===== Top Statistics ===== */}
			<div
				className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${
					loading ? "opacity-50" : ""
				}`}
			>
				{statCards.map((stat, i) => (
					<div
						key={i}
						className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 hover:shadow-md transition"
					>
						<div className="flex flex-col">
							<span className={`text-3xl font-bold ${stat.color}`}>
								{stat.value}
							</span>
							<span className="text-sm font-medium text-gray-500 mt-2 tracking-wide uppercase">
								{stat.title}
							</span>
						</div>
					</div>
				))}
			</div>
			{/* ===== Recent News Section ===== */}
			<div className="bg-white border border-gray-200 rounded-xl shadow-sm mt-10">
				{/* Header */}
				<div className="flex justify-between items-center px-8 py-6 border-b border-gray-200">
					<div>
						<h2 className="text-2xl font-semibold text-gray-800">
							Recent News
						</h2>
						<p className="text-sm text-gray-500 mt-1">
							Latest published and pending articles
						</p>
					</div>

					<Link
						to="/dashboard/news"
						className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-black transition text-sm"
					>
						View All
					</Link>
				</div>

				{/* Table */}
				<div className="overflow-x-auto">
					<table className="w-full text-sm">
						<thead className="bg-gray-50 text-gray-600 uppercase tracking-wider text-xs border-b border-gray-200">
							<tr>
								<th className="py-4 px-8 text-left font-medium">No</th>
								<th className="py-4 px-8 text-left font-medium">Title</th>
								<th className="py-4 px-8 text-left font-medium">Image</th>
								<th className="py-4 px-8 text-left font-medium">Category</th>
								<th className="py-4 px-8 text-left font-medium">Date</th>
								<th className="py-4 px-8 text-left font-medium">Status</th>
								<th className="py-4 px-8 text-left font-medium">Action</th>
							</tr>
						</thead>

						<tbody className="divide-y divide-gray-100 text-gray-700">
							{[1, 2, 3].map((n, index) => (
								<tr key={index} className="hover:bg-gray-50 transition">
									<td className="py-4 px-8 text-gray-500">{index + 1}</td>

									<td className="py-4 px-8 font-medium text-gray-800">title</td>

									<td className="py-4 px-8">
										<img
											className="w-10 h-10 rounded-full object-cover border border-gray-200"
											src={profile}
											alt="news"
										/>
									</td>

									<td className="py-4 px-8">
										<span className="px-3 py-1 text-xs rounded-full bg-gray-200 text-gray-700">
											category
										</span>
									</td>

									<td className="py-4 px-8 text-gray-500">12-22-2222</td>

									<td className="py-4 px-8">
										<span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-700">
											Active
										</span>
									</td>

									<td className="py-4 px-8">
										<div className="flex items-center gap-3">
											<Link
												to=""
												className="p-2 rounded-md bg-gray-800 text-white hover:bg-black transition"
											>
												<FaEdit size={14} />
											</Link>

											<button
												className="cursor-pointer p-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition"
											>
												<FaTrashAlt size={14} />
											</button>
										</div>
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

export default Adminindex;
