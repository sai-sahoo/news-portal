import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { base_url } from "../../../config/config";
import storeContext from "../../../context/storeContext";

const AddEditPoll = () => {
	const { id } = useParams();
	const isEditMode = Boolean(id);

	const { store } = useContext(storeContext);
	const navigate = useNavigate();

	const [loader, setLoader] = useState(false);
	const [contentLang, setContentLang] = useState("en");
	const [question, setQuestion] = useState("");
	const [status, setStatus] = useState("active");
	const [options, setOptions] = useState(["", ""]);

	// Load poll in edit mode
	useEffect(() => {
		if (isEditMode) {
			getPollData();
		}
	}, [id]);

	const getPollData = async () => {
		try {
			const { data } = await axios.get(`${base_url}/api/polls/${id}`, {
				headers: {
					Authorization: `Bearer ${store.token}`,
				},
			});
			setContentLang(data.poll.contentLang);
			setQuestion(data.poll.question);
			setStatus(data.poll.status);
			setOptions(data.poll.options.map((opt) => opt.text));
		} catch (error) {
			toast.error("Failed to load poll");
		}
	};

	const handleOptionChange = (value, index) => {
		const updated = [...options];
		updated[index] = value;
		setOptions(updated);
	};

	const addOption = () => {
		setOptions([...options, ""]);
	};

	const removeOption = (index) => {
		if (options.length <= 2) {
			toast.error("Minimum 2 options required");
			return;
		}
		setOptions(options.filter((_, i) => i !== index));
	};

	const submit = async (e) => {
		e.preventDefault();
		setLoader(true);

		try {
			let response;

			if (isEditMode) {
				response = await axios.put(
					`${base_url}/api/polls/${id}`,
					{
						contentLang,
						question,
						status,
						options,
					},
					{
						headers: {
							Authorization: `Bearer ${store.token}`,
						},
					}
				);
			} else {
				response = await axios.post(
					`${base_url}/api/polls`,
					{
						contentLang,
						question,
						options,
					},
					{
						headers: {
							Authorization: `Bearer ${store.token}`,
						},
					}
				);
			}

			toast.success(response.data.message);
			navigate("/dashboard/polls");
		} catch (error) {
			toast.error(error.response?.data?.message || "Something went wrong");
		}

		setLoader(false);
	};

	return (
		<div className="min-h-screen bg-gray-100 p-8">
			<div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg border border-gray-200">
				{/* Header */}
				<div className="flex justify-between items-center px-8 py-6 border-b border-gray-200">
					<div>
						<h2 className="text-2xl font-semibold text-gray-800">
							{isEditMode ? "Edit Poll" : "Add Poll"}
						</h2>
						<p className="text-sm text-gray-500 mt-1">
							{isEditMode ? "Update poll information" : "Create a new poll"}
						</p>
					</div>
					<Link
						to="/dashboard/polls"
						className="px-5 py-2 bg-gray-800 text-white rounded-md hover:bg-black transition duration-300 text-sm"
					>
						Polls
					</Link>
				</div>

				<div className="px-8 py-8">
					<form onSubmit={submit} autoComplete="off" className="space-y-6">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Language
							</label>
							<select
								name="contentLang"
								value={contentLang || ""}
								onChange={(e) => setContentLang(e.target.value)}
								required
								className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-800 outline-none text-sm"
							>
								<option value="" disabled>Select Language</option>
								<option value="en">English</option>
								<option value="hi">Hindi</option>
								<option value="od">Odia</option>
							</select>
						</div>
						{/* Question */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Question
							</label>
							<input
								type="text"
								required
								value={question}
								onChange={(e) => setQuestion(e.target.value)}
								className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-gray-800 outline-none h-11"
								placeholder="Enter poll question"
							/>
						</div>

						{/* Options */}
						<div>
							<label className="block mb-3 text-sm font-medium">Options</label>

							{options.map((opt, index) => (
								<div key={index} className="flex gap-3 mb-3">
									<input
										type="text"
										required
										value={opt}
										onChange={(e) => handleOptionChange(e.target.value, index)}
										className="flex-1 px-4 py-2 border rounded-md border-gray-300 focus:ring-2 focus:ring-gray-800 outline-none h-11"
										placeholder={`Option ${index + 1}`}
									/>

									<button
										type="button"
										onClick={() => removeOption(index)}
										className="cursor-pointer px-4 bg-red-600 text-white rounded-md"
									>
										X
									</button>
								</div>
							))}

							<button
								type="button"
								onClick={addOption}
								className="cursor-pointer mt-2 px-4 py-2 bg-gray-800 text-white rounded-md"
							>
								+ Option
							</button>
						</div>

						{/* Status (Edit only) */}
						{isEditMode && (
							<div>
								<label className="block mb-2 text-sm font-medium">Status</label>
								<select
									value={status}
									onChange={(e) => setStatus(e.target.value)}
									className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-800 outline-none text-sm"
								>
									<option value="active">Active</option>
									<option value="inactive">Inactive</option>
								</select>
							</div>
						)}

						<button className="cursor-pointer px-6 py-3 bg-gray-800 text-white rounded-md">
							{loader ? "Loading..." : isEditMode ? "Update Poll" : "Save Poll"}
						</button>
					</form>
				</div>
			</div>
		</div>
	);
};

export default AddEditPoll;
