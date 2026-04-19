import { useState, useContext, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { base_url } from "../../../config/config";
import storeContext from "../../../context/storeContext";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import CategoryTree from "./CategoryTree";

const CategoryList = () => {
	const { store } = useContext(storeContext);
	const queryClient = useQueryClient();

	const [contentLangFilter, setContentLangFilter] = useState(
		localStorage.getItem("cat_lang") ? localStorage.getItem("cat_lang") : "en"
	);
	const [expanded, setExpanded] = useState({});

	// use the delay for testing loader
	// const delay = (ms) => new Promise((res) => setTimeout(res, ms));
	const { data, isPending, isError, error } = useQuery({
		queryKey: ["categories", contentLangFilter],
		queryFn: async () => {
			// await delay(5000);
			const { data } = await axios.get(`${base_url}/api/categories`, {
				headers: {
					Authorization: `Bearer ${store.token}`,
				},
				params: {
					lang: contentLangFilter,
				},
			});
			return data;
		},
		enabled: !!store.token,
		onError: (err) => {
			toast.error(err.response?.data?.message || "Failed to fetch categories");
		},
		staleTime: 1000 * 60 * 5, // 10 minutes
		refetchOnWindowFocus: false,
		refetchOnReconnect: true,
	});

	const buildTree = (categories, parentId = null) => {
		return categories
			.filter((cat) => {
				if (parentId === null) {
					return !cat.parentCategory;
				}
				return String(cat.parentCategory) === String(parentId);
			})
			.map((cat) => ({
				...cat,
				children: buildTree(categories, cat._id),
			}));
	};

	const treeData = useMemo(() => {
		return data?.data ? buildTree(data.data) : [];
	}, [data]);

	const deleteMutation = useMutation({
		mutationFn: async (id) => {
			const { data } = await axios.delete(`${base_url}/api/categories/${id}`, {
				headers: {
					Authorization: `Bearer ${store.token}`,
				},
			});
			return data;
		},
		onSuccess: (data) => {
			toast.success(data.message);
			queryClient.invalidateQueries({
				queryKey: ["categories"],
			});
		},
		onError: (err) => {
			toast.error(err.response?.data?.message || "Delete failed");
		},
	});

	/* if (isPending) {
		return (
			<div className="flex flex-col items-center justify-center h-40 text-gray-500">
				<div className="w-8 h-8 border-4 border-gray-200 border-t-gray-800 rounded-full animate-spin mb-3"></div>
				Loading categories...
			</div>
		);
	} */

	const toggleExpand = (id) => {
		setExpanded((prev) => ({
			...prev,
			[id]: !prev[id],
		}));
	};

	const handleDelete = (id) => {
		if (!window.confirm("Are you sure, you want to delete this Category?")) {
			return;
		}
		deleteMutation.mutate(id);
	};

	return (
		<div className="min-h-screen bg-gray-100 p-8">
			<div className="max-w-6xl mx-auto bg-white border border-gray-200 rounded-2xl shadow-sm">
				{/* Header */}
				<div className="flex justify-between items-center px-8 py-6 border-b border-gray-200">
					<div>
						<h2 className="text-2xl font-semibold text-gray-800">
							Category Management
						</h2>
						<p className="text-sm text-gray-500 mt-1">
							Organize and manage your newsroom taxonomy
						</p>
					</div>

					<Link
						to="/dashboard/categories/add"
						className="px-5 py-2 bg-gray-900 text-white hover:bg-black transition text-sm"
					>
						+ Add Category
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
								localStorage.setItem("cat_lang", e.target.value);
							}}
							className="w-48 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-800 outline-none text-sm"
						>
							<option value="" disabled>--Language--</option>
							<option value="en">English</option>
							<option value="hi">Hindi</option>
							<option value="od">Odia</option>
						</select>
					</div>
				</div>

				{/* Content Area */}
				<div className="p-8">
					{(isPending || deleteMutation.isPending) && (
						<div className="absolute inset-0 z-40 flex items-center justify-center bg-white/70 backdrop-blur-sm">
							<div className="w-10 h-10 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin"></div>
						</div>
					)}
					{treeData.length === 0 ? (
						<div className="flex flex-col items-center justify-center h-60 text-gray-500">
							<p className="text-lg font-medium">No Categories Found</p>
							<p className="text-sm mt-1">Start by creating a new category</p>
						</div>
					) : (
						<div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
							<CategoryTree
								nodes={treeData}
								onDelete={handleDelete}
								expanded={expanded}
								toggleExpand={toggleExpand}
								contentLangFilter
							/>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default CategoryList;
