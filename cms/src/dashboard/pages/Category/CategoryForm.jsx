import { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import slugify from "slugify";
import axios from "axios";
import { base_url } from "../../../config/config";
import storeContext from "../../../context/storeContext";
import toast from "react-hot-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const CategoryForm = () => {
	const { store } = useContext(storeContext);
	const { id } = useParams();
	const queryClient = useQueryClient();
	const navigate = useNavigate();
	const isEdit = !!id;
	const [form, setForm] = useState({
		contentLang: localStorage.getItem("cat_lang")
			? localStorage.getItem("cat_lang")
			: "en",
		name: "",
		nameRegional: "",
		description: "",
		parentCategory: "",
		isActive: true,
		showInMenu: true,
		showInHomePage: false,
		metaTitle: "",
		metaDescription: "",
	});

	const {
		data: categories,
		isPending,
		isError,
		error,
	} = useQuery({
		queryKey: ["categories", id, form.contentLang],
		queryFn: async () => {
			const { data } = await axios.get(`${base_url}/api/categories`, {
				headers: {
					Authorization: `Bearer ${store.token}`,
				},
				params: {
					lang: form.contentLang,
				},
			});
			const tree = buildCategoryTree(data.data);
			const flattened = flattenCategories(tree);
			return flattened;
		},
		enabled: !!store.token,
	});

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

	const {
		data: singleCategory,
		isPending: singlePending,
		isError: isSingleError,
		error: singleError,
	} = useQuery({
		queryKey: ["category", id],
		queryFn: async () => {
			const { data } = await axios.get(`${base_url}/api/categories/${id}`, {
				headers: {
					Authorization: `Bearer ${store.token}`,
				},
			});
			return data.data;
		},
		enabled: !!store.token && isEdit,
	});
	useEffect(() => {
		if (singleCategory) {
			setForm((prev) => ({
				...prev,
				contentLang: singleCategory.contentLang || "",
				name: singleCategory.name || "",
				nameRegional: singleCategory.nameRegional || "",
				description: singleCategory.description || "",
				parentCategory: singleCategory.parentCategory || "",
				isActive: singleCategory.isActive ?? true,
				showInMenu: singleCategory.showInMenu ?? true,
				showInHomePage: singleCategory.showInHomePage ?? false,
				metaTitle: singleCategory.metaTitle || "",
				metaDescription: singleCategory.metaDescription || "",
			}));
		}
	}, [singleCategory]);

	const buildTree = (categories, parentId = null) => {
		return categories
			.filter((cat) => (cat.parentCategory || null) === parentId)
			.map((cat) => ({
				...cat,
				children: buildTree(categories, cat._id),
			}));
	};
	const getDescendantIds = (nodes, targetId) => {
		let ids = [];

		const findNode = (items) => {
			for (let item of items) {
				if (item._id === targetId) {
					collectChildren(item);
				} else if (item.children.length) {
					findNode(item.children);
				}
			}
		};

		const collectChildren = (node) => {
			for (let child of node.children) {
				ids.push(child._id);
				collectChildren(child);
			}
		};

		findNode(nodes);
		return ids;
	};

	let restrictedIds = [];
	if (categories) {
		const treeData = buildTree(categories);
		if (isEdit && id) {
			restrictedIds = [id, ...getDescendantIds(treeData, id)];
		}
	}
	const handleChange = (e) => {
		const { name, value, type, checked } = e.target;
		const newValue = type === "checkbox" ? checked : value;
		setForm((prev) => {
			const updatedForm = {
				...prev,
				[name]: newValue,
			};
			// Reset regional name if English selected
			if (name === "contentLang" && newValue === "en") {
				updatedForm.nameRegional = "";
			}
			// Save language to localStorage ONLY when it changes
			if (name === "contentLang") {
				localStorage.setItem("cat_lang", newValue);
			}
			return updatedForm;
		});
	};

	/* const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			if (isEdit) {
				const { data } = await axios.put(
					`${base_url}/api/categories/${id}`,
					form,
					{
						headers: {
							Authorization: `Bearer ${store.token}`,
						},
					}
				);
				toast.success(data.message);
			} else {
				const { data } = await axios.post(`${base_url}/api/categories`, form, {
					headers: {
						Authorization: `Bearer ${store.token}`,
					},
				});
				toast.success(data.message);
			}
			navigate("/dashboard/categories");
		} catch (error) {
			toast.error(error.response.data.message);
			console.log("Save failed");
		} finally {
		}
	}; */
	const handleSubmit = (e) => {
		e.preventDefault();
		saveCategoryMutation.mutate(form);
	};
	const saveCategoryMutation = useMutation({
		mutationFn: async (formData) => {
			if (isEdit) {
				const { data } = await axios.put(
					`${base_url}/api/categories/${id}`,
					formData,
					{
						headers: {
							Authorization: `Bearer ${store.token}`,
						},
					}
				);
				return data;
			} else {
				const { data } = await axios.post(
					`${base_url}/api/categories`,
					formData,
					{
						headers: {
							Authorization: `Bearer ${store.token}`,
						},
					}
				);
				return data;
			}
		},
		onSuccess: (data) => {
			toast.success(data.message);
			// Invalidate category list so it refetches
			queryClient.invalidateQueries({ queryKey: ["categories"] });
			navigate("/dashboard/categories");
		},
		onError: (error) => {
			toast.error(error?.response?.data?.message || "Something went wrong");
		},
	});

	return (
		<div className="min-h-screen bg-gray-100 p-8">
			<div className="max-w-4xl mx-auto bg-white rounded-2xl border border-gray-200 shadow-sm">
				{/* Header */}
				<div className="px-8 py-6 border-b border-gray-200">
					<h2 className="text-2xl font-semibold text-gray-800">
						{isEdit ? "Edit Category" : "Create New Category"}
					</h2>
					<p className="text-sm text-gray-500 mt-1">
						Manage taxonomy and SEO configuration
					</p>
				</div>
				{isPending && singlePending ? (
					<div className="flex flex-col items-center justify-center h-40 text-gray-500">
						<div className="w-8 h-8 border-4 border-gray-200 border-t-gray-800 rounded-full animate-spin mb-3"></div>
						Loading categories...
					</div>
				) : (
					<form onSubmit={handleSubmit} className="p-8 space-y-8">
						{/* ===== Basic Information Section ===== */}
						<div>
							<h3 className="text-lg font-semibold text-gray-800 mb-4">
								Basic Information
							</h3>

							<div className="grid grid-cols-2 gap-6">
								{/* Language */}
								<div>
									<label className="block text-sm font-medium text-gray-600 mb-1">
										Language
									</label>
									<select
										name="contentLang"
										value={form.contentLang || ""}
										onChange={handleChange}
										required
										className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-800 outline-none text-sm"
									>
										<option value="" disabled>Select Language</option>
										<option value="en">English</option>
										<option value="hi">Hindi</option>
										<option value="od">Odia</option>
									</select>
								</div>

								{/* Parent Category */}
								<div>
									<label className="block text-sm font-medium text-gray-600 mb-1">
										Parent Category
									</label>
									<select
										name="parentCategory"
										value={form.parentCategory || ""}
										onChange={handleChange}
										className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-800 outline-none text-sm"
									>
										<option value="">None</option>
										{categories?.map((cat) => (
											<option
												key={cat._id}
												value={cat._id}
												disabled={restrictedIds.includes(cat._id)}
											>
												{"— ".repeat(cat.level)}
												{cat.contentLang === "en" ? cat.name : cat.nameRegional}
											</option>
										))}
									</select>
								</div>
							</div>

							{/* Name */}
							<div className="mt-6">
								<label className="block text-sm font-medium text-gray-600 mb-1">
									Category Name
								</label>
								<input
									name="name"
									value={form.name}
									onChange={handleChange}
									required
									className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-800 outline-none text-sm"
								/>

								{/* Slug Preview */}
								<div className="mt-2 text-sm text-gray-500">
									Slug:
									<span className="ml-2 px-2 py-1 bg-gray-100 rounded text-gray-700">
										{slugify(form.name || "", { lower: true })}
									</span>
								</div>
							</div>

							{/* Regional Name */}
							{form.contentLang && form.contentLang !== "en" && (
								<div className="mt-6">
									<label className="block text-sm font-medium text-gray-600 mb-1">
										Regional Name ({form.contentLang})
									</label>
									<input
										name="nameRegional"
										value={form.nameRegional}
										onChange={handleChange}
										required={form.contentLang !== "en"}
										className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-800 outline-none text-sm"
									/>
								</div>
							)}
						</div>

						{/* ===== Display Settings Section ===== */}
						<div>
							<h3 className="text-lg font-semibold text-gray-800 mb-4">
								Display Settings
							</h3>

							<div className="flex gap-10">
								{/* Active Toggle */}
								<label className="flex items-center gap-3 cursor-pointer">
									<div className="relative">
										<input
											type="checkbox"
											name="isActive"
											checked={form.isActive}
											onChange={handleChange}
											className="sr-only"
										/>
										<div
											className={`w-11 h-6 rounded-full transition ${
												form.isActive ? "bg-green-500" : "bg-gray-300"
											}`}
										>
											<div
												className={`h-5 w-5 bg-white rounded-full shadow transform transition ${
													form.isActive ? "translate-x-5" : "translate-x-1"
												} mt-0.5`}
											/>
										</div>
									</div>
									<span className="text-sm text-gray-700">Active</span>
								</label>

								{/* Menu Toggle */}
								<label className="flex items-center gap-3 cursor-pointer">
									<div className="relative">
										<input
											type="checkbox"
											name="showInMenu"
											checked={form.showInMenu}
											onChange={handleChange}
											className="sr-only"
										/>
										<div
											className={`w-11 h-6 rounded-full transition ${
												form.showInMenu ? "bg-green-500" : "bg-gray-300"
											}`}
										>
											<div
												className={`h-5 w-5 bg-white rounded-full shadow transform transition ${
													form.showInMenu ? "translate-x-5" : "translate-x-1"
												} mt-0.5`}
											/>
										</div>
									</div>
									<span className="text-sm text-gray-700">Show In Menu</span>
								</label>

								{/* Show In Home Page Toggle */}
								<label className="flex items-center gap-3 cursor-pointer">
									<div className="relative">
										<input
											type="checkbox"
											name="showInHomePage"
											checked={form.showInHomePage}
											onChange={handleChange}
											className="sr-only"
										/>
										<div
											className={`w-11 h-6 rounded-full transition ${
												form.showInHomePage ? "bg-green-500" : "bg-gray-300"
											}`}
										>
											<div
												className={`h-5 w-5 bg-white rounded-full shadow transform transition ${
													form.showInHomePage ? "translate-x-5" : "translate-x-1"
												} mt-0.5`}
											/>
										</div>
									</div>
									<span className="text-sm text-gray-700">Show In Home Page</span>
								</label>
							</div>
						</div>

						{/* ===== SEO Section ===== */}
						<div>
							<h3 className="text-lg font-semibold text-gray-800 mb-4">
								SEO Settings
							</h3>

							<div className="space-y-6">
								<div>
									<label className="block text-sm font-medium text-gray-600 mb-1">
										Meta Title
									</label>
									<input
										name="metaTitle"
										value={form.metaTitle}
										onChange={handleChange}
										className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-800 outline-none text-sm"
									/>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-600 mb-1">
										Meta Description
									</label>
									<textarea
										name="metaDescription"
										value={form.metaDescription}
										onChange={handleChange}
										rows="3"
										className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-800 outline-none text-sm resize-none"
									/>
								</div>
							</div>
						</div>

						{/* ===== Submit Section ===== */}
						<div className="pt-6 border-t border-gray-200 flex justify-end">
							<button
								type="submit"
								disabled={saveCategoryMutation.isPending}
								className="cursor-pointer px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-black transition text-sm disabled:opacity-50"
							>
								{saveCategoryMutation.isPending
									? isEdit
										? "Updating..."
										: "Saving..."
									: isEdit
									? "Update Category"
									: "Save Category"}
							</button>
						</div>
					</form>
				)}
			</div>
		</div>
	);
};

export default CategoryForm;
