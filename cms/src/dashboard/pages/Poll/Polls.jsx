import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { base_url } from "../../../config/config";
import storeContext from "../../../context/storeContext";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const Polls = () => {
	const { store } = useContext(storeContext);
	const [currentPage, setCurrentPage] = useState(1);
	const [limit, setLimit] = useState(5);
	const [totalPages, setTotalPages] = useState(1);
	const [polls, setPolls] = useState([]);
	const [contentLangFilter, setContentLangFilter] = useState("en");

	const getPolls = async () => {
		try {
			const { data } = await axios.get(`${base_url}/api/polls`, {
				headers: {
					Authorization: `Bearer ${store.token}`,
				},
				params: {
					lang: contentLangFilter,
					page: currentPage,
					limit,
				},
			});
			setPolls(data.polls);
			setTotalPages(data.totalPages);
		} catch (error) {
			toast.error(error.message);
		}
	};

	useEffect(() => {
		getPolls();
	}, [contentLangFilter, currentPage, limit]);

	const deletePoll = async (id) => {
		if (!window.confirm("Delete this poll?")) return;

		try {
			const { data } = await axios.delete(`${base_url}/api/polls/${id}`, {
				headers: {
					Authorization: `Bearer ${store.token}`,
				},
			});
			toast.success(data.message);
			getPolls();
		} catch (error) {
			toast.error("Delete failed");
		}
	};

	return (
		<div className="min-h-screen bg-gray-100 p-8">
			<div className="max-w-6xl mx-auto bg-white border border-gray-200 rounded-lg shadow-sm">
				<div className="flex justify-between items-center px-8 py-6 border-b border-gray-200">
					<div>
						<h2 className="text-2xl font-semibold text-gray-800">Polls</h2>
						<p className="text-sm text-gray-500 mt-1">Manage Polls</p>
					</div>

					<Link
						to="/dashboard/poll/add"
						className="px-5 py-2 bg-gray-800 text-white rounded-md hover:bg-black transition duration-300 text-sm"
					>
						+ Add Poll
					</Link>
				</div>
				{/* Filter Section */}
				<div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between">
					<div>
						<label className="block text-xs text-gray-500 mb-1">
							Filter by Language
						</label>
						<select
							value={contentLangFilter}
							onChange={(e) => {
								setContentLangFilter(e.target.value);
								setCurrentPage(1);
								// localStorage.setItem("cat_lang", e.target.value);
							}}
							className="w-48 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-800 outline-none text-sm"
						>
							<option value="" disabled>
								--Language--
							</option>
							<option value="en">English</option>
							<option value="hi">Hindi</option>
							<option value="od">Odia</option>
						</select>
					</div>
				</div>
				<div className="overflow-x-auto">
					<table className="w-full text-sm">
						<thead className="bg-gray-50 text-gray-600 uppercase tracking-wider text-xs border-b border-gray-200">
							<tr>
								<th className="py-4 px-8 text-left font-medium">No</th>
								<th className="py-4 px-8 text-left font-medium">Language</th>
								<th className="py-4 px-8 text-left font-medium">Question</th>
								<th className="py-4 px-8 text-left font-medium">Status</th>
								<th className="py-4 px-8 text-left font-medium">Total Votes</th>
								<th className="py-4 px-8 text-left font-medium">Action</th>
							</tr>
						</thead>

						<tbody className="divide-y divide-gray-100 text-gray-700">
							{polls.map((poll, index) => {
								const totalVotes = poll.options.reduce(
									(sum, opt) => sum + opt.votes,
									0
								);

								return (
									<tr key={poll._id} className="hover:bg-gray-50 transition">
										<td className="py-4 px-8">
											<span className="text-gray-500">{index + 1}</span>
										</td>
										<td className="py-4 px-8 font-medium text-gray-800">
											{poll.contentLang}
										</td>
										<td className="py-4 px-8 font-medium text-gray-800">
											{poll.question}
										</td>
										<td className="py-4 px-8">
											{poll.status === "active" ? (
												<span className="px-3 py-1 text-xs rounded-full bg-green-200 text-green-700">
													{poll.status}
												</span>
											) : (
												<span className="px-3 py-1 text-xs rounded-full bg-gray-200 text-gray-700">
													{poll.status}
												</span>
											)}
										</td>
										<td className="py-4 px-8 text-gray-600">{totalVotes}</td>
										<td className="py-4 px-8 flex gap-3">
											<Link
												to={`/dashboard/poll/edit/${poll._id}`}
												className="p-2 bg-gray-800 text-white rounded"
											>
												<FaEdit size={14} />
											</Link>

											<button
												onClick={() => deletePoll(poll._id)}
												className="cursor-pointer p-2 bg-red-600 text-white rounded"
											>
												<FaTrashAlt size={14} />
											</button>
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>
			</div>
			<div className="bg-white border border-slate-200 flex justify-between items-center pt-6 text-sm text-slate-600 p-6 space-y-6">
				<div className="flex flex-wrap items-center gap-4">
					<label className="text-sm font-semibold">Polls Per Page:</label>
					<select
						value={limit}
						onChange={(e) => {
							setLimit(parseInt(e.target.value));
							setCurrentPage(1); // reset to first page
						}}
						className="px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
					>
						<option value="5">5</option>
						<option value="10">10</option>
						<option value="15">15</option>
						<option value="20">20</option>
					</select>
				</div>

				<div className="flex items-center gap-4 text-sm text-gray-600">
					<span className="font-bold">
						Page {currentPage} of {totalPages}
					</span>
					<div className="flex gap-2">
						<IoIosArrowBack
							className={`w-5 h-5 cursor-pointer ${
								currentPage === 1 ? "text-slate-300" : "hover:text-slate-900"
							}`}
							onClick={() => {
								if (currentPage > 1) {
									setCurrentPage(currentPage - 1);
								}
							}}
						/>
						<IoIosArrowForward
							className={`w-5 h-5 cursor-pointer ${
								currentPage === totalPages
									? "text-slate-300"
									: "hover:text-slate-900"
							}`}
							onClick={() => {
								if (currentPage < totalPages) {
									setCurrentPage(currentPage + 1);
								}
							}}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Polls;
