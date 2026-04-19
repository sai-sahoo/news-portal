import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { base_url } from "../../../../config/config";
import storeContext from "../../../../context/storeContext";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const Placements = () => {
	const { store } = useContext(storeContext);

	const [placements, setPlacements] = useState([]);
	const [pageTypeFilter, setPageTypeFilter] = useState("homepage");
	const [currentPage, setCurrentPage] = useState(1);
	const [limit, setLimit] = useState(5);
	const [totalPages, setTotalPages] = useState(1);

	const getPlacements = async () => {
		try {
			const { data } = await axios.get(`${base_url}/api/ads/placements`, {
				headers: { Authorization: `Bearer ${store.token}` },
				params: {
					pageType: pageTypeFilter,
					page: currentPage,
					limit,
				},
			});

			setPlacements(data.placements);
			setTotalPages(data.totalPages);
		} catch (error) {
			toast.error("Failed to load placements");
		}
	};

	useEffect(() => {
		getPlacements();
	}, [pageTypeFilter, currentPage, limit]);

	const deletePlacement = async (id) => {
		if (!window.confirm("Delete this placement?")) return;

		try {
			const { data } = await axios.delete(
				`${base_url}/api/ads/placements/${id}`,
				{ headers: { Authorization: `Bearer ${store.token}` } }
			);

			toast.success(data.message);
			getPlacements();
		} catch {
			toast.error("Delete failed");
		}
	};

	const toggleStatus = async (id) => {
		try {
			await axios.patch(
				`${base_url}/api/ads/placements/${id}/toggle`,
				{},
				{ headers: { Authorization: `Bearer ${store.token}` } }
			);

			getPlacements();
		} catch {
			toast.error("Status update failed");
		}
	};

	return (
		<div className="min-h-screen bg-gray-100 p-8">
			<div className="max-w-6xl mx-auto bg-white border rounded-lg shadow-sm">
				<div className="flex justify-between items-center px-8 py-6 border-b">
					<div>
						<h2 className="text-2xl font-semibold">Placements</h2>
						<p className="text-sm text-gray-500">Manage Inventory Slots</p>
					</div>

					<Link
						to="/dashboard/ad/placement/add"
						className="px-5 py-2 bg-gray-800 text-white rounded-md text-sm"
					>
						+ Add Placement
					</Link>
				</div>

				{/* Filter */}
				<div className="px-8 py-6 border-b">
					<label className="block text-xs text-gray-500 mb-1">
						Filter by Page Type
					</label>
					<select
						value={pageTypeFilter}
						onChange={(e) => {
							setPageTypeFilter(e.target.value);
							setCurrentPage(1);
						}}
						className="w-48 px-4 py-2 border rounded-lg"
					>
						<option value="homepage">Homepage</option>
						<option value="article">Article</option>
						<option value="category">Category</option>
						<option value="mobile">Mobile</option>
					</select>
				</div>

				<div className="overflow-x-auto">
					<table className="w-full text-sm">
						<thead className="bg-gray-50 text-xs uppercase">
							<tr>
								<th className="py-4 px-8 text-left">No</th>
								<th className="py-4 px-8 text-left">Name</th>
								<th className="py-4 px-8 text-left">Code</th>
								<th className="py-4 px-8 text-left">Size</th>
								<th className="py-4 px-8 text-left">Page Type</th>
								<th className="py-4 px-8 text-left">Active</th>
								<th className="py-4 px-8 text-left">Action</th>
							</tr>
						</thead>

						<tbody>
							{placements.map((p, index) => (
								<tr key={p._id} className="border-t">
									<td className="py-4 px-8">{index + 1}</td>
									<td className="py-4 px-8">{p.name}</td>
									<td className="py-4 px-8">{p.code}</td>
									<td className="py-4 px-8">{p.size}</td>
									<td className="py-4 px-8">{p.pageType}</td>
									<td className="py-4 px-8">
										<button
											onClick={() => toggleStatus(p._id)}
											className={`px-3 py-1 text-xs rounded-full ${
												p.isActive
													? "bg-green-200 text-green-700"
													: "bg-gray-200 text-gray-700"
											}`}
										>
											{p.isActive ? "Active" : "Inactive"}
										</button>
									</td>
									<td className="py-4 px-8 flex gap-3">
										<Link
											to={`/dashboard/ad/placement/edit/${p._id}`}
											className="p-2 bg-gray-800 text-white rounded"
										>
											<FaEdit size={14} />
										</Link>

										<button
											onClick={() => deletePlacement(p._id)}
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

export default Placements;
