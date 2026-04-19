import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { base_url } from "../../config/config";
import axios from "axios";
import toast from "react-hot-toast";
import storeContext from "../../context/storeContext";

const EditWriter = () => {
	const { id } = useParams();
	const { store } = useContext(storeContext);
	const [loader, setLoader] = useState(false);
	const navigate = useNavigate();
	const [state, setState] = useState({
		name: "",
		email: "",
		role: "",
	});
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
				role: data.writer.role,
			});
		} catch (error) {
			console.log(error);
			toast.error('Failed to load writer data')
		}
	};
	useEffect(() => {
		getWriterData();
	}, [id]);
	const inputHandle = (e) => {
		setState({
			...state,
			[e.target.name]: e.target.value,
		});
	};
	const handleUpdateWriter = async (e) => {
		e.preventDefault();
		try {
			setLoader(true);
			const { data } = await axios.put(`${base_url}/api/update/writer/${id}`, state, {
				headers: {
					Authorization: `Bearer ${store.token}`,
				},
			});
			setLoader(false);
			toast.success(data.message)
			navigate("/dashboard/writers");
		} catch (error) {
			setLoader(false);
			toast.error(error.response.data.message);
			console.log(error);
		}
	};
	return (
		<div className="bg-white rounded-md">
			<div className="flex justify-between p-4">
				<h2 className="text-xl font-semibold">Edit Writer</h2>
				<Link
					className="px-3 py-[6px] bg-blue-500 rounded-md text-white hover:bg-blue-800"
					to="/dashboard/writers"
				>
					Writers
				</Link>
			</div>

			<div className="p-4">
				<form onSubmit={handleUpdateWriter}>
					<div className="grid grid-cols-2 gap-x-8 mb-3">
						<div className="flex flex-col gap-y-2">
							<label
								htmlFor="name"
								className="text-md font-semibold text-gray-600"
							>
								Name
							</label>
							<input
								value={state.name}
								onChange={inputHandle}
								required
								type="text"
								placeholder="Name"
								name="name"
								className="px-3 py-2 rounded-md outline-0 border border-gray-300 focus:border-blue-500 h-10"
								id="name"
							/>
						</div>
					</div>

					<div className="grid grid-cols-2 gap-x-8 mb-3">
						<div className="flex flex-col gap-y-2">
							<label
								htmlFor="email"
								className="text-md font-semibold text-gray-600"
							>
								Email
							</label>
							<input
								value={state.email}
								onChange={inputHandle}
								required
								type="email"
								placeholder="Email"
								name="email"
								className="px-3 py-2 rounded-md outline-0 border border-gray-300 focus:border-blue-500 h-10"
								id="email"
							/>
						</div>

						<div className="flex flex-col gap-y-2">
							<label
								htmlFor="role"
								className="text-md font-semibold text-gray-600"
							>
								Role
							</label>
							<input
								value={state.role}
								onChange={inputHandle}
								required
								type="text"
								placeholder="Role"
								name="role"
								className="px-3 py-2 rounded-md outline-0 border border-gray-300 focus:border-blue-500 h-10"
								id="role"
								readOnly
							/>
						</div>
					</div>

					<div className="mt-4">
						<button className="cursor-pointer px-3 py-[6px] bg-blue-500 rounded-md text-white hover:bg-blue-800">
							{loader ? "Loading..." : "Update Writer"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default EditWriter;
