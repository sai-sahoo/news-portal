import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { base_url } from "../../../../config/config";
import storeContext from "../../../../context/storeContext";

const AddEditAdvertiser = () => {
	const { id } = useParams();
	const isEditMode = Boolean(id);

	const { store } = useContext(storeContext);
	const navigate = useNavigate();

	const [loader, setLoader] = useState(false);

	const [name, setName] = useState("");
	const [company, setCompany] = useState("");
	const [email, setEmail] = useState("");
	const [phone, setPhone] = useState("");
	const [website, setWebsite] = useState("");
	const [billingModel, setBillingModel] = useState("prepaid");
	const [status, setStatus] = useState("active");

	useEffect(() => {
		if (isEditMode) getAdvertiser();
	}, [id]);

	const getAdvertiser = async () => {
		try {
			const { data } = await axios.get(
				`${base_url}/api/ads/advertisers/${id}`,
				{
					headers: { Authorization: `Bearer ${store.token}` },
				}
			);

			const adv = data.advertiser;

			setName(adv.name);
			setCompany(adv.company);
			setEmail(adv.email);
			setPhone(adv.phone);
			setWebsite(adv.website);
			setBillingModel(adv.billingModel);
			setStatus(adv.status);
		} catch {
			toast.error("Failed to load advertiser");
		}
	};

	const submit = async (e) => {
		e.preventDefault();
		setLoader(true);

		try {
			const payload = {
				name,
				company,
				email,
				phone,
				website,
				billingModel,
				status,
			};

			if (isEditMode) {
				await axios.put(`${base_url}/api/ads/advertisers/${id}`, payload, {
					headers: { Authorization: `Bearer ${store.token}` },
				});
			} else {
				await axios.post(`${base_url}/api/ads/advertisers`, payload, {
					headers: { Authorization: `Bearer ${store.token}` },
				});
			}

			toast.success(
				isEditMode
					? "Advertiser updated successfully"
					: "Advertiser created successfully"
			);

			navigate("/dashboard/ads/advertisers");
		} catch (error) {
			toast.error(error.response?.data?.message || "Something went wrong");
		}

		setLoader(false);
	};

	return (
		<div className="min-h-screen bg-gray-100 p-8">
			<div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg border border-gray-200">
				{/* Header */}
				<div className="flex justify-between items-center px-8 py-6 border-b">
					<div>
						<h2 className="text-2xl font-semibold">
							{isEditMode ? "Edit Advertiser" : "Add Advertiser"}
						</h2>
						<p className="text-sm text-gray-500 mt-1">
							Manage advertiser information
						</p>
					</div>

					<Link
						to="/dashboard/ads/advertisers"
						className="px-5 py-2 bg-gray-800 text-white rounded-md text-sm"
					>
						Advertisers
					</Link>
				</div>

				<div className="px-8 py-8">
					<form onSubmit={submit} className="space-y-6">
						<input
							type="text"
							required
							value={name}
							onChange={(e) => setName(e.target.value)}
							placeholder="Advertiser Name"
							className="w-full px-4 py-2 border rounded-md h-11"
						/>

						<input
							type="text"
							value={company}
							onChange={(e) => setCompany(e.target.value)}
							placeholder="Company"
							className="w-full px-4 py-2 border rounded-md h-11"
						/>

						<input
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder="Email"
							className="w-full px-4 py-2 border rounded-md h-11"
						/>

						<input
							type="text"
							value={phone}
							onChange={(e) => setPhone(e.target.value)}
							placeholder="Phone"
							className="w-full px-4 py-2 border rounded-md h-11"
						/>

						<input
							type="url"
							value={website}
							onChange={(e) => setWebsite(e.target.value)}
							placeholder="Website"
							className="w-full px-4 py-2 border rounded-md h-11"
						/>

						<select
							value={billingModel}
							onChange={(e) => setBillingModel(e.target.value)}
							className="w-full px-4 py-2 border rounded-lg"
						>
							<option value="prepaid">Prepaid</option>
							<option value="postpaid">Postpaid</option>
						</select>

						{isEditMode && (
							<select
								value={status}
								onChange={(e) => setStatus(e.target.value)}
								className="w-full px-4 py-2 border rounded-lg"
							>
								<option value="active">Active</option>
								<option value="inactive">Inactive</option>
							</select>
						)}

						<button className="px-6 py-3 bg-gray-800 text-white rounded-md">
							{loader
								? "Loading..."
								: isEditMode
								? "Update Advertiser"
								: "Save Advertiser"}
						</button>
					</form>
				</div>
			</div>
		</div>
	);
};

export default AddEditAdvertiser;
