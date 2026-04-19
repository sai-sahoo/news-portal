import { Link, useNavigate } from "react-router-dom";
import { FaImages } from "react-icons/fa6";
import JoditEditor from "jodit-react";
import { useContext, useRef, useState } from "react";
import Gallery from "../components/Gallery";
import { base_url } from "../../config/config";
import axios from "axios";
import toast from "react-hot-toast";
import storeContext from "../../context/storeContext";
import { useEffect } from "react";

const CreateNews = () => {
	const navigate = useNavigate();
	const { store } = useContext(storeContext);

	const [loader, setLoader] = useState(false);
	const [show, setShow] = useState(false);

	const editor = useRef(null);
	const editorConfig = {
		readonly: false,
		height: 500,
		askBeforePasteHTML: true,
		askBeforePasteFromWord: true,
		defaultActionOnPaste: "ask",
		cleanHTML: {
			removeEmptyElements: false,
		},
	};
	const [contentLang, setContentLang] = useState("");
	const [categories, setCategories] = useState([]);
	const [categoryId, setCategoryId] = useState("");
	const [title, setTitle] = useState("");
	const [titleRegional, setTitleRegional] = useState("");
	const [image, setImage] = useState(null);
	const [img, setImg] = useState(null);
	const [description, setDescription] = useState("");
	const [metaTitle, setMetaTitle] = useState("");
	const [metaDescription, setMetaDescription] = useState("");
	const [metaKeywords, setMetaKeywords] = useState([]);
	const [inputValue, setInputValue] = useState("");

	const handleKeyDown = (e) => {
		if (e.key === "Enter" && inputValue.trim() !== "") {
			e.preventDefault();

			const newKeywords = inputValue
				.split(",")
				.map((k) => k.trim().toLowerCase())
				.filter((k) => k.length > 0);

			const updatedKeywords = [...new Set([...metaKeywords, ...newKeywords])];

			setMetaKeywords(updatedKeywords);
			setInputValue("");
		}
	};
	const removeKeyword = (index) => {
		setMetaKeywords(metaKeywords.filter((_, i) => i !== index));
	};
	const imageHandle = (e) => {
		const { files } = e.target;
		if (files.length > 0) {
			setImg(URL.createObjectURL(files[0]));
			setImage(files[0]);
		}
	};
	const fetchCategories = async () => {
		if (!contentLang) return;
		try {
			const { data } = await axios.get(`${base_url}/api/categories`, {
				headers: {
					Authorization: `Bearer ${store.token}`,
				},
				params: {
					lang: contentLang,
				},
			});
			const tree = buildCategoryTree(data.data);
			const flattened = flattenCategories(tree);
			setCategories(flattened);
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		if (!contentLang) return;
		fetchCategories();
	}, [contentLang]);

	const buildCategoryTree = (categories) => {
		const map = {};
		const roots = [];

		// Create map
		categories.forEach((cat) => {
			map[cat._id] = { ...cat, children: [] };
		});

		// Build tree
		categories.forEach((cat) => {
			if (cat.parentCategory) {
				map[cat.parentCategory]?.children.push(map[cat._id]);
			} else {
				roots.push(map[cat._id]);
			}
		});

		return roots;
	};
	const flattenCategories = (tree, level = 0) => {
		let result = [];

		tree.forEach((node) => {
			result.push({
				...node,
				level,
			});

			if (node.children.length > 0) {
				result = result.concat(flattenCategories(node.children, level + 1));
			}
		});

		return result;
	};
	const added = async (e) => {
		e.preventDefault();
		const formData = new FormData();
		formData.append("contentLang", contentLang);
		formData.append("categoryId", categoryId);
		formData.append("title", title);
		formData.append("titleRegional", titleRegional);
		formData.append("description", description);
		formData.append("image", image);
		formData.append("metaTitle", metaTitle);
		formData.append("metaDescription", metaDescription);
		formData.append("metaKeywords", JSON.stringify(metaKeywords));
		// console.log(Object.fromEntries(formData));
		// return;
		try {
			setLoader(true);
			const { data } = await axios.post(`${base_url}/api/news/add`, formData, {
				headers: {
					Authorization: `Bearer ${store.token}`,
				},
			});
			setLoader(false);
			toast.success(data.message);
			setContentLang("");
			setCategoryId("");
			setTitle("");
			setTitleRegional("");
			setDescription("");
			setImg(null);
			setImage(null);
			setMetaTitle("");
			setMetaDescription("");
			setMetaKeywords([]);
			navigate("/dashboard/news");
		} catch (error) {
			setLoader(false);
			toast.error(error.response.data.message);
			console.log(error);
		}
	};
	const [images, setImages] = useState([]);
	const get_images = async () => {
		try {
			const { data } = await axios.get(`${base_url}/api/news/images`, {
				headers: {
					Authorization: `Bearer ${store.token}`,
				},
			});
			setImages(data.images);
		} catch (error) {
			console.log(error);
		}
	};
	useEffect(() => {
		get_images();
	}, []);
	const [imagesLoader, setImagesLoader] = useState(false);
	const imageHandler = async (e) => {
		const files = e.target.files;
		try {
			const formData = new FormData();
			for (let i = 0; i < files.length; i++) {
				formData.append("images", files[i]);
			}
			setImagesLoader(true);
			const { data } = await axios.post(
				`${base_url}/api/news/images/add`,
				formData,
				{
					headers: {
						Authorization: `Bearer ${store.token}`,
					},
				}
			);
			setImagesLoader(false);
			setImages((prev) => [...prev, ...data.images]);
			toast.success(data.message);
		} catch (error) {
			console.log(error);
			setImagesLoader(false);
		}
	};
	return (
		<div className="min-h-screen bg-gray-100 p-8">
			<div className="max-w-5xl mx-auto bg-white shadow-md rounded-lg border border-gray-200">
				{/* Header */}
				<div className="flex justify-between items-center px-8 py-6 border-b border-gray-200">
					<div>
						<h2 className="text-2xl font-semibold text-gray-800">
							Add News Article
						</h2>
						<p className="text-sm text-gray-500 mt-1">
							Create and publish a news article
						</p>
					</div>

					<Link
						className="px-5 py-2 bg-gray-800 text-white rounded-md hover:bg-black transition duration-300 text-sm"
						to="/dashboard/news"
					>
						View All
					</Link>
				</div>

				<form onSubmit={added} className="px-8 py-8 space-y-8">
					{/* ================= BASIC INFO ================= */}
					<div className="grid md:grid-cols-2 gap-6">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Language
							</label>
							<select
								name="contentLang"
								value={contentLang || ""}
								onChange={(e) => {
									const lang = e.target.value;
									setContentLang(lang);
									if (lang === "en") setTitleRegional("");
								}}
								className="w-full px-4 py-2 border rounded-md border-gray-300 focus:ring-2 focus:ring-gray-800 outline-none h-10"
								required
							>
								<option value="" disabled>--Choose--</option>
								<option value="en">English</option>
								<option value="hi">Hindi</option>
								<option value="od">Odia</option>
							</select>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Category
							</label>
							<select
								name="categoryId"
								value={categoryId || ""}
								onChange={(e) => setCategoryId(e.target.value)}
								className="w-full px-4 py-2 border rounded-md border-gray-300 focus:ring-2 focus:ring-gray-800 outline-none h-10"
								required
							>
								<option value="" disabled>--Choose--</option>
								{categories.map((cat) => (
									<option key={cat._id} value={cat._id}>
										{"— ".repeat(cat.level)}
										{cat.contentLang === "en" ? cat.name : cat.nameRegional}
									</option>
								))}
							</select>
						</div>
					</div>

					{/* ================= TITLES ================= */}
					<div className="space-y-5">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Title in English
							</label>
							<input
								value={title}
								onChange={(e) => setTitle(e.target.value)}
								type="text"
								placeholder="Enter News Title"
								name="title"
								id="title"
								className="w-full px-4 py-2 border rounded-md border-gray-300 focus:ring-2 focus:ring-gray-800 outline-none h-11"
								required
							/>
						</div>

						{contentLang !== "en" && (
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Title - <span className="text-red-600">{contentLang}</span>
								</label>
								<input
									value={titleRegional}
									onChange={(e) => setTitleRegional(e.target.value)}
									type="text"
									placeholder="Enter News Title in regional lang"
									className="w-full px-4 py-2 border rounded-md border-gray-300 focus:ring-2 focus:ring-gray-800 outline-none h-11"
									required={contentLang !== "en"}
								/>
							</div>
						)}
					</div>

					{/* ================= IMAGE UPLOAD ================= */}
					<div>
						<label
							htmlFor="img"
							className="w-full h-[260px] flex flex-col items-center justify-center cursor-pointer border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-800 transition bg-gray-50"
						>
							{img ? (
								<img
									src={img}
									className="w-full h-full object-contain"
									alt="image"
								/>
							) : (
								<div className="flex justify-center items-center flex-col gap-y-2">
									<FaImages className="text-4xl mb-2" />
									<span className="font-medium">Click to Select Image</span>
								</div>
							)}
						</label>

						<input
							onChange={imageHandle}
							type="file"
							className="hidden"
							id="img"
						/>
					</div>

					{/* ================= EDITOR ================= */}
					<div>
						<div className="flex justify-between items-center mb-3">
							<label className="block text-sm font-medium text-gray-700">
								Description -{" "}
								<span className="text-red-600">{contentLang}</span>
							</label>

							<div
								onClick={() => setShow(true)}
								className="text-gray-600 hover:text-black cursor-pointer"
							>
								<FaImages className="text-xl" />
							</div>
						</div>

						{/* Editor made visually bigger */}
						<div className="border border-gray-300 rounded-md overflow-hidden">
							<JoditEditor
								ref={editor}
								value={description}
								tabIndex={1}
								onBlur={(value) => setDescription(value)}
								onChange={() => {}}
								className="w-full min-h-[500px]"
							/>
						</div>
					</div>

					{/* ================= SEO SECTION ================= */}
					<div className="border-t pt-6 space-y-5">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Meta Title - <span className="text-red-600">{contentLang}</span>
							</label>
							<input
								value={metaTitle}
								onChange={(e) => setMetaTitle(e.target.value)}
								type="text"
								placeholder="Enter Meta Title"
								name="metaTitle"
								id="metaTitle"
								className="w-full px-4 py-2 border rounded-md border-gray-300 focus:ring-2 focus:ring-gray-800 outline-none h-11"
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Meta Description -{" "}
								<span className="text-red-600">{contentLang}</span>
							</label>
							<textarea
								value={metaDescription}
								onChange={(e) => {
									setMetaDescription(e.target.value);
									e.target.style.height = "auto";
									e.target.style.height = e.target.scrollHeight + "px";
								}}
								className="w-full px-4 py-2 border rounded-md border-gray-300 focus:ring-2 focus:ring-gray-800 outline-none resize-none"
							/>
						</div>

						{/* ===== META KEYWORDS RESTORED EXACTLY ===== */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Meta Keywords -{" "}
								<span className="text-red-600">{contentLang}</span>
							</label>

							<div className="border rounded-md p-2 flex flex-wrap gap-2 border-gray-300 focus-within:ring-2 focus-within:ring-gray-800 transition">
								{metaKeywords.map((keyword, index) => (
									<span
										key={index}
										className="bg-gray-200 text-gray-800 px-2 py-1 rounded-md text-sm flex items-center gap-1"
									>
										{keyword}
										<button
											type="button"
											onClick={() => removeKeyword(index)}
											className="ml-1"
										>
											×
										</button>
									</span>
								))}

								<input
									type="text"
									id="metaKeywords"
									value={inputValue}
									onChange={(e) => setInputValue(e.target.value)}
									onKeyDown={handleKeyDown}
									className="outline-none flex-grow min-w-[120px]"
									placeholder="Type keyword and press Enter"
								/>
							</div>
						</div>
					</div>

					{/* ================= SUBMIT ================= */}
					<div className="pt-4">
						<button
							type="submit"
							className="cursor-pointer px-6 py-3 bg-gray-800 rounded-md text-white hover:bg-black transition font-medium"
						>
							{loader ? "Loading..." : "Add News"}
						</button>
					</div>
				</form>

				{show && <Gallery setShow={setShow} images={images} />}

				<input
					onChange={imageHandler}
					type="file"
					multiple
					id="images"
					className="hidden"
				/>
			</div>
		</div>
	);
};

export default CreateNews;
