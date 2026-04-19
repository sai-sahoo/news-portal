import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { base_url } from "../../../../config/config";
import storeContext from "../../../../context/storeContext";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const Advertisers = () => {
	const { store } = useContext(storeContext);

	const [advertisers, setAdvertisers] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [limit, setLimit] = useState(5);
	const [totalPages, setTotalPages] = useState(1);
	const [search, setSearch] = useState("");

	const getAdvertisers = async () => {
		try {
			const { data } = await axios.get(`${base_url}/api/ads/advertisers`, {
				headers: { Authorization: `Bearer ${store.token}` },
				params: {
					page: currentPage,
					limit,
					search,
				},
			});

			setAdvertisers(data.advertisers);
			setTotalPages(data.totalPages);
		} catch (error) {
			toast.error("Failed to load advertisers");
		}
	};

	useEffect(() => {
		getAdvertisers();
	}, [currentPage, limit, search]);

	const deleteAdvertiser = async (id) => {
		if (!window.confirm("Delete this advertiser?")) return;

		try {
			const { data } = await axios.delete(
				`${base_url}/api/ads/advertisers/${id}`,
				{
					headers: { Authorization: `Bearer ${store.token}` },
				}
			);

			toast.success(data.message);
			getAdvertisers();
		} catch {
			toast.error("Delete failed");
		}
	};

	const toggleStatus = async (id) => {
		try {
			await axios.patch(
				`${base_url}/api/ads/advertisers/${id}/toggle`,
				{},
				{
					headers: { Authorization: `Bearer ${store.token}` },
				}
			);
			getAdvertisers();
		} catch {
			toast.error("Status update failed");
		}
	};

	return (
		<div className="min-h-screen bg-gray-100 p-8">
			<div className="max-w-6xl mx-auto bg-white border rounded-lg shadow-sm">
				{/* Header */}
				<div className="flex justify-between items-center px-8 py-6 border-b">
					<div>
						<h2 className="text-2xl font-semibold">Advertisers</h2>
						<p className="text-sm text-gray-500">Manage Businesses</p>
					</div>

					<Link
						to="/dashboard/ad/advertiser/add"
						className="px-5 py-2 bg-gray-800 text-white rounded-md text-sm"
					>
						+ Add Advertiser
					</Link>
				</div>

				{/* Search */}
				<div className="px-8 py-6 border-b flex justify-between items-center">
					<input
						type="text"
						placeholder="Search by name..."
						value={search}
						onChange={(e) => {
							setSearch(e.target.value);
							setCurrentPage(1);
						}}
						className="w-64 px-4 py-2 border rounded-lg"
					/>
				</div>

				{/* Table */}
				<div className="overflow-x-auto">
					<table className="w-full text-sm">
						<thead className="bg-gray-50 text-xs uppercase">
							<tr>
								<th className="py-4 px-8 text-left">No</th>
								<th className="py-4 px-8 text-left">Name</th>
								<th className="py-4 px-8 text-left">Company</th>
								<th className="py-4 px-8 text-left">Email</th>
								<th className="py-4 px-8 text-left">Campaigns</th>
								<th className="py-4 px-8 text-left">Status</th>
								<th className="py-4 px-8 text-left">Action</th>
							</tr>
						</thead>

						<tbody>
							{advertisers.map((adv, index) => (
								<tr key={adv._id} className="border-t">
									<td className="py-4 px-8">{index + 1}</td>
									<td className="py-4 px-8">{adv.name}</td>
									<td className="py-4 px-8">{adv.company}</td>
									<td className="py-4 px-8">{adv.email}</td>
									<td className="py-4 px-8">{adv.campaignCount}</td>

									<td className="py-4 px-8">
										<button
											onClick={() => toggleStatus(adv._id)}
											className={`px-3 py-1 text-xs rounded-full ${
												adv.status === "active"
													? "bg-green-200 text-green-700"
													: "bg-gray-200 text-gray-700"
											}`}
										>
											{adv.status}
										</button>
									</td>

									<td className="py-4 px-8 flex gap-3">
										<Link
											to={`/dashboard/ad/advertiser/edit/${adv._id}`}
											className="p-2 bg-gray-800 text-white rounded"
										>
											<FaEdit size={14} />
										</Link>

										<button
											onClick={() => deleteAdvertiser(adv._id)}
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

				{/* Pagination */}
				<div className="bg-white border-t flex justify-between items-center p-6 text-sm">
					<div className="flex items-center gap-4">
						<label className="font-semibold">Per Page:</label>
						<select
							value={limit}
							onChange={(e) => {
								setLimit(parseInt(e.target.value));
								setCurrentPage(1);
							}}
							className="px-4 py-2 border rounded-md"
						>
							<option value="5">5</option>
							<option value="10">10</option>
							<option value="15">15</option>
						</select>
					</div>

					<div className="flex items-center gap-4">
						<span className="font-bold">
							Page {currentPage} of {totalPages}
						</span>
						<div className="flex gap-2">
							<IoIosArrowBack
								className={`cursor-pointer ${
									currentPage === 1 ? "text-gray-300" : ""
								}`}
								onClick={() =>
									currentPage > 1 && setCurrentPage(currentPage - 1)
								}
							/>
							<IoIosArrowForward
								className={`cursor-pointer ${
									currentPage === totalPages ? "text-gray-300" : ""
								}`}
								onClick={() =>
									currentPage < totalPages && setCurrentPage(currentPage + 1)
								}
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Advertisers;
