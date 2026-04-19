import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { base_url } from "../../config/config";
import axios from "axios";
import toast from "react-hot-toast";
import storeContext from "../../context/storeContext";

const AddEditWriter = () => {
	const { id } = useParams();
	const isEditMode = Boolean(id);

	const { store } = useContext(storeContext);
	const navigate = useNavigate();
	const [loader, setLoader] = useState(false);

	const [state, setState] = useState({
		name: "",
		email: "",
		password: "",
		role: "",
	});

	// Load writer data in edit mode
	useEffect(() => {
		if (isEditMode) {
			getWriterData();
		}
	}, [id]);

	const getWriterData = async () => {
		try {
			const { data } = await axios.get(`${base_url}/api/news/writer/${id}`, {
				headers: {
					Authorization: `Bearer ${store.token}`,
				},
			});

			setState({
				name: data.writer.name,
				email: data.writer.email,
				password: "",
				role: data.writer.role,
			});
		} catch (error) {
			toast.error("Failed to load writer data");
			console.log(error);
		}
	};

	const inputHandle = (e) => {
		setState({
			...state,
			[e.target.name]: e.target.value,
		});
	};

	const submit = async (e) => {
		e.preventDefault();

		try {
			setLoader(true);

			let response;

			if (isEditMode) {
				// Update
				response = await axios.put(
					`${base_url}/api/update/writer/${id}`,
					{
						name: state.name,
						email: state.email,
						role: state.role,
					},
					{
						headers: {
							Authorization: `Bearer ${store.token}`,
						},
					}
				);
			} else {
				// Add
				response = await axios.post(
					`${base_url}/api/writer/add`,
					{
						name: state.name,
						email: state.email,
						password: state.password,
					},
					{
						headers: {
							Authorization: `Bearer ${store.token}`,
						},
					}
				);
			}

			setLoader(false);
			toast.success(response.data.message);
			navigate("/dashboard/writers");
		} catch (error) {
			setLoader(false);
			toast.error(error.response?.data?.message || "Something went wrong");
			console.log(error);
		}
	};

	return (
		<div className="min-h-screen bg-gray-100 p-8">
			<div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg border border-gray-200">
				{/* Header */}
				<div className="flex justify-between items-center px-8 py-6 border-b border-gray-200">
					<div>
						<h2 className="text-2xl font-semibold text-gray-800">
							{isEditMode ? "Edit Writer" : "Add Writer"}
						</h2>
						<p className="text-sm text-gray-500 mt-1">
							{isEditMode
								? "Update writer information"
								: "Create a new writer account"}
						</p>
					</div>

					<Link
						className="px-5 py-2 bg-gray-800 text-white rounded-md hover:bg-black transition duration-300 text-sm"
						to="/dashboard/writers"
					>
						Writers
					</Link>
				</div>

				{/* Form */}
				<div className="px-8 py-8">
					<form onSubmit={submit} autoComplete="off" className="space-y-6">
						{/* Name */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Name
							</label>
							<input
								value={state.name}
								onChange={inputHandle}
								required
								type="text"
								name="name"
								placeholder="Enter full name"
								className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-gray-800 outline-none h-11"
							/>
						</div>

						{/* Email + Password/Role */}
						<div className="grid md:grid-cols-2 gap-6">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Email
								</label>
								<input
									value={state.email}
									onChange={inputHandle}
									required
									type="email"
									name="email"
									placeholder="Enter email address"
									className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-gray-800 outline-none h-11"
								/>
							</div>

							{/* Password only in Add mode */}
							{!isEditMode && (
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Password
									</label>
									<input
										value={state.password}
										onChange={inputHandle}
										required
										type="password"
										name="password"
										placeholder="Enter password"
										className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-gray-800 outline-none h-11"
									/>
								</div>
							)}

							{/* Role only in Edit mode */}
							{isEditMode && (
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Role
									</label>
									<input
										value={state.role}
										readOnly
										type="text"
										className="w-full px-4 py-2 rounded-md border border-gray-300 bg-gray-100 h-11"
									/>
								</div>
							)}
						</div>

						{/* Submit Button */}
						<div className="pt-4">
							<button className="cursor-pointer px-6 py-3 bg-gray-800 rounded-md text-white hover:bg-black transition font-medium">
								{loader
									? "Loading..."
									: isEditMode
									? "Update Writer"
									: "Add Writer"}
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default AddEditWriter;
