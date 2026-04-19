import { Link } from "react-router-dom";
import { FaEye } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import { FaTrashAlt } from "react-icons/fa";
import profile from "../../assets/profile.png";
import { base_url } from "../../config/config";
import axios from "axios";
import { useContext, useState, useEffect } from "react";
import storeContext from "../../context/storeContext";
import toast from "react-hot-toast";

const Writers = () => {
	const { store } = useContext(storeContext);
	const [writers, setWriters] = useState([]);
	const [loading, setLoading] = useState(false);
	const get_writers = async () => {
		try {
			const { data } = await axios.get(`${base_url}/api/news/writers`, {
				headers: {
					Authorization: `Bearer ${store.token}`,
				},
			});
			setWriters(data.writers);
		} catch (error) {
			console.log(error);
		}
	};
	useEffect(() => {
		get_writers();
	}, []);
	const handleDeleteWriter = async (id) => {
		if (!window.confirm("Are you sure, you want to delete this write?")) {
			return;
		}
		setLoading(true);
		try {
			const { data } = await axios.delete(
				`${base_url}/api/delete/writer/${id}`,
				{
					headers: {
						Authorization: `Bearer ${store.token}`,
					},
				}
			);
			toast.success(data.message);
			get_writers();
			// setWriters(data.writers);
		} catch (error) {
			console.log(error);
		}
	};
	return (
		<div className="min-h-screen bg-gray-100 p-8">
			<div className="max-w-6xl mx-auto bg-white border border-gray-200 rounded-lg shadow-sm">
				{/* Header */}
				<div className="flex justify-between items-center px-8 py-6 border-b border-gray-200">
					<div>
						<h2 className="text-2xl font-semibold text-gray-800">Writers</h2>
						<p className="text-sm text-gray-500 mt-1">
							Manage newsroom writers and accounts
						</p>
					</div>

					<Link
						to="/dashboard/writer/add"
						className="px-5 py-2 bg-gray-800 text-white rounded-md hover:bg-black transition duration-300 text-sm"
					>
						Add Writer
					</Link>
				</div>

				{/* Table */}
				<div className="overflow-x-auto">
					<table className="w-full text-sm">
						<thead className="bg-gray-50 text-gray-600 uppercase tracking-wider text-xs border-b border-gray-200">
							<tr>
								<th className="py-4 px-8 text-left font-medium">No</th>
								<th className="py-4 px-8 text-left font-medium">Name</th>
								<th className="py-4 px-8 text-left font-medium">Role</th>
								<th className="py-4 px-8 text-left font-medium">Image</th>
								<th className="py-4 px-8 text-left font-medium">Email</th>
								<th className="py-4 px-8 text-left font-medium">Action</th>
							</tr>
						</thead>

						<tbody className="divide-y divide-gray-100 text-gray-700">
							{writers.map((item, index) => (
								<tr key={item._id} className="hover:bg-gray-50 transition">
									<td className="py-4 px-8">
										<span className="text-gray-500">{index + 1}</span>
									</td>

									<td className="py-4 px-8 font-medium text-gray-800">
										{item.name}
									</td>

									<td className="py-4 px-8">
										<span className="px-3 py-1 text-xs rounded-full bg-gray-200 text-gray-700">
											{item.role}
										</span>
									</td>

									<td className="py-4 px-8">
										<img
											className="w-10 h-10 rounded-full object-cover border border-gray-200"
											src={profile}
											alt="writer"
										/>
									</td>

									<td className="py-4 px-8 text-gray-600">{item.email}</td>

									<td className="py-4 px-8">
										<div className="flex items-center gap-3">
											<Link
												to={`/dashboard/writer/edit/${item._id}`}
												className="p-2 rounded-md bg-gray-800 text-white hover:bg-black transition"
											>
												<FaEdit size={14} />
											</Link>

											<button
												onClick={() => handleDeleteWriter(item._id)}
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

export default Writers;
