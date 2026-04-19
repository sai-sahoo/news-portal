import { Link } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import { FaTrashAlt } from "react-icons/fa";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";
import { useContext, useEffect, useState } from "react";
import storeContext from "../../context/storeContext";
import axios from "axios";
import { base_url } from "../../config/config";
import toast from "react-hot-toast";
import {
	keepPreviousData,
	useMutation,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";

const NewsContent = () => {
	const { store } = useContext(storeContext);
	const queryClient = useQueryClient();
	const [currentPage, setCurrentPage] = useState(1);
	const [limit, setLimit] = useState(5);
	const [statusFilter, setStatusFilter] = useState("");
	const [contentLangFilter, setContentLangFilter] = useState("");
	const [search, setSearch] = useState("");
	const [debouncedSearch, setDebouncedSearch] = useState("");
	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedSearch(search);
			setCurrentPage(1); // reset to first page when searching
		}, 500); // 500ms delay

		return () => clearTimeout(timer);
	}, [search]);

	// Define the query key variables so they are accessible inside the mutation
	const newsQueryKey = [
		"news",
		{
			page: currentPage,
			limit,
			contentLang: contentLangFilter,
			search: debouncedSearch,
			status: statusFilter,
		},
	];
	const {
		data: newsData,
		isPending,
		isError,
		error,
	} = useQuery({
		queryKey: newsQueryKey,
		queryFn: async () => {
			const { data } = await axios.get(`${base_url}/api/news`, {
				headers: {
					Authorization: `Bearer ${store.token}`,
				},
				params: {
					page: currentPage,
					limit,
					...(statusFilter && { status: statusFilter }),
					...(contentLangFilter && { contentLang: contentLangFilter }),
					...(debouncedSearch && { search: debouncedSearch }),
				},
			});
			return data;
		},
		enabled: !!store.token, // if false, it disables automatic refetching when query mounts.
		placeholderData: keepPreviousData, //smooth pagination. retain current page until next page data came.
		// staleTime: 1000 * 60 * 5,
		// refetchOnWindowFocus: false,
		// refetchOnReconnect: true,
		// refetchInterval: 1000, // for pooling in every 1 sec
		// refetchIntervalInBackground: true, // pooling won't stop if tab is not in focus
	});
	const { news = [], totalPages = 1, totalItems = 0 } = newsData || {};

	const { mutate: deleteNews, isPending: isDeleting } = useMutation({
		mutationFn: async (id) => {
			const { data } = await axios.delete(`${base_url}/api/news/delete/${id}`, {
				headers: {
					Authorization: `Bearer ${store.token}`,
				},
			});
			return data;
		},
		onSuccess: (data) => {
			toast.success(data.message);
			queryClient.invalidateQueries({ queryKey: newsQueryKey });
		},
		onError: (error) => {
			const errorMsg = error.response?.data?.message || "Failed to delete";
			toast.error(errorMsg);
			console.error(error);
		},
	});
	const handleDeleteNews = (id) => {
		if (window.confirm("Are you sure you want to delete this news?")) {
			deleteNews(id);
		}
	};
	const { mutate: updateStatus } = useMutation({
		mutationFn: async ({ id, newStatus }) => {
			const { data } = await axios.patch(
				`${base_url}/api/news/update/status`,
				{ news_id: id, status: newStatus },
				{ headers: { Authorization: `Bearer ${store.token}` } }
			);
			return data;
		},
		// 1. When the mutation starts (Optimistic Update)
		onMutate: async ({ id, newStatus }) => {
			// Cancel any outgoing refetches (so they don't overwrite our optimistic update)
			await queryClient.cancelQueries({ queryKey: newsQueryKey });

			// Snapshot the previous value
			const previousNewsData = queryClient.getQueryData(newsQueryKey);

			// Optimistically update to the new value in the cache
			queryClient.setQueryData(newsQueryKey, (old) => ({
				...old,
				news: old.news.map((item) =>
					item._id === id ? { ...item, status: newStatus } : item
				),
			}));
			// Return a context object with the snapshotted value
			return { previousNewsData };
		},
		// 2. If the mutation fails, use the context we returned above to rollback
		onError: (err, variables, context) => {
			queryClient.setQueryData(newsQueryKey, context.previousNewsData);
			toast.error("Failed to update status");
		},
		// 3. Always refetch after error or success to sync with the server
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: newsQueryKey });
		},
		onSuccess: (data) => {
			toast.success(data.message);
		},
	});
	const handleStatusChange = (id, newStatus) => {
		updateStatus({ id, newStatus });
	};

	const {
		mutate: toggleNewsType,
		isPending: toggleNewsPending,
		variables,
	} = useMutation({
		mutationFn: async ({ id, field, value }) => {
			// Dynamic URL based on which toggle is clicked
			let endpoint = "";
			if (field === "isBreaking") {
				endpoint = "breaking";
			} else if (field === "isFeatured") {
				endpoint = "featured";
			} else {
				endpoint = "pinned";
			}
			const { data } = await axios.patch(
				`${base_url}/api/news/update/${endpoint}`,
				{ news_id: id, [field]: value },
				{ headers: { Authorization: `Bearer ${store.token}` } }
			);
			return data;
		},
		// --- Optimistic Update Logic ---
		onMutate: async ({ id, field, value }) => {
			// 1. Cancel outgoing refetches
			await queryClient.cancelQueries({ queryKey: newsQueryKey });

			// 2. Snapshot the current state
			const previousData = queryClient.getQueryData(newsQueryKey);

			// 3. Optimistically update the cache
			queryClient.setQueryData(newsQueryKey, (old) => ({
				...old,
				news: old.news.map((n) =>
					n._id === id ? { ...n, [field]: value } : n
				),
			}));
			// 4. Return context for rollback
			return { previousData };
		},
		onError: (err, variables, context) => {
			// Rollback to the previous state if the API fails
			queryClient.setQueryData(newsQueryKey, context.previousData);
			toast.error(
				`Failed to update ${
					variables.field === "isBreaking"
						? "breaking"
						: "isFeatured"
						? "featured"
						: "pinned"
				} status`
			);
		},
		onSuccess: (data) => {
			toast.success(data.message);
		},
		onSettled: () => {
			// Always refetch to ensure we are in sync with the server
			queryClient.invalidateQueries({ queryKey: newsQueryKey });
		},
	});
	const handleBreakingToggle = (item) => {
		toggleNewsType({
			id: item._id,
			field: "isBreaking",
			value: !item.isBreaking,
		});
	};
	const handleFeaturedToggle = (item) => {
		toggleNewsType({
			id: item._id,
			field: "isFeatured",
			value: !item.isFeatured,
		});
	};
	const handlePinnedToggle = (item) => {
		toggleNewsType({
			id: item._id,
			field: "isPinned",
			value: !item.isPinned,
		});
	};

	return (
		<div className="bg-white border border-slate-200 p-6 space-y-6">
			<div className="flex items-center gap-4">
				<select
					value={contentLangFilter}
					onChange={(e) => {
						setContentLangFilter(e.target.value);
						setCurrentPage(1);
					}}
					name="contentLangFilter"
					className="px-3 py-2 text-sm border border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-500"
				>
					<option value="">--Language--</option>
					<option value="en">English</option>
					<option value="hi">Hindi</option>
					<option value="od">Odia</option>
				</select>
				<select
					value={statusFilter}
					onChange={(e) => {
						setStatusFilter(e.target.value);
						setCurrentPage(1);
					}}
					name="statusFilter"
					className="px-3 py-2 text-sm border border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-500"
				>
					<option value="">--Status--</option>
					<option value="pending">Pending</option>
					<option value="published">Published</option>
				</select>
				<input
					type="text"
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					placeholder="Search News"
					className="px-3 py-2 text-sm border border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-500"
				/>
			</div>

			<div className="w-full">
				<div className="overflow-x-auto border border-slate-200">
					<table className="min-w-[1200px] w-full text-sm text-left border-collapse">
						<thead className="bg-slate-50 text-slate-600 uppercase text-xs tracking-wider">
							<tr>
								<th className="px-4 py-3 border-b border-slate-200 font-medium">
									No
								</th>
								<th className="px-4 py-3 border-b border-slate-200 font-medium">
									Title
								</th>
								<th className="px-4 py-3 border-b border-slate-200 font-medium">
									Image
								</th>
								<th className="px-4 py-3 border-b border-slate-200 font-medium">
									Category
								</th>
								{store?.userInfo?.role === "admin" && (
									<>
										<th className="px-4 py-3 border-b border-slate-200 font-medium">
											Breaking
										</th>
										<th className="px-4 py-3 border-b border-slate-200 font-medium">
											Featured
										</th>
										<th className="px-4 py-3 border-b border-slate-200 font-medium">
											Pinned
										</th>
									</>
								)}

								<th className="px-4 py-3 border-b border-slate-200 font-medium">
									Date
								</th>
								<th className="px-4 py-3 border-b border-slate-200 font-medium">
									Status
								</th>
								<th className="px-4 py-3 border-b border-slate-200 font-medium">
									Action
								</th>
							</tr>
						</thead>
						<tbody className="text-gray-600">
							{news.map((item, index) => {
								// Check if THIS specific row is being processed
								const isThisItemUpdating =
									toggleNewsPending && variables?.id === item._id;
								return (
									<tr
										key={item._id}
										className="border-b border-slate-100 hover:bg-slate-50 transition"
									>
										<td className="py-4 px-6">
											{(currentPage - 1) * limit + index + 1}
										</td>
										<td className="py-4 px-6">
											{item.contentLang === "en"
												? item.title.slice(0, 15)
												: item.titleRegional.slice(0, 15)}
											..
										</td>
										<td className="py-4 px-6">
											{item.image && item.image !== "null" ? (
												<img
													className="w-10 h-10"
													src={item.image}
													alt="news image"
												/>
											) : (
												"No Image"
											)}
										</td>
										<td className="py-4 px-6">
											{item.contentLang === "en"
												? item?.categoryId?.name
												: item?.categoryId?.nameRegional}
										</td>
										{store?.userInfo?.role === "admin" && (
											<>
												<td className="px-4 py-3 text-center">
													{isThisItemUpdating &&
													variables?.field === "isBreaking" ? (
														<span className="spinner">🌀</span>
													) : (
														<input
															type="checkbox"
															checked={item?.isBreaking || false}
															onChange={() => handleBreakingToggle(item)}
															className="w-4 h-4 accent-slate-900"
														/>
													)}
												</td>
												<td className="px-4 py-3 text-center">
													{isThisItemUpdating &&
													variables?.field === "isFeatured" ? (
														<span className="spinner">🌀</span>
													) : (
														<input
															type="checkbox"
															checked={item?.isFeatured || false}
															onChange={() => handleFeaturedToggle(item)}
															className="w-4 h-4 accent-slate-900"
														/>
													)}
												</td>
												<td className="px-4 py-3 text-center">
													{isThisItemUpdating &&
													variables?.field === "isPinned" ? (
														<span className="spinner">🌀</span>
													) : (
														<input
															type="checkbox"
															checked={item?.isPinned || false}
															onChange={() => handlePinnedToggle(item)}
															className="w-4 h-4 accent-slate-900"
														/>
													)}
												</td>
											</>
										)}
										<td className="py-4 px-2">
											{new Date(item.createdAt).toLocaleDateString("en-IN", {
												day: "2-digit",
												month: "short",
												year: "numeric",
											})}
										</td>
										<td className="py-4 px-2">
											{store?.userInfo?.role === "admin" ? (
												<select
													value={item.status}
													onChange={(e) =>
														handleStatusChange(item._id, e.target.value)
													}
													name="status"
													className="text-left px-2 py-1 text-sm border border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-500"
												>
													<option value="">Select</option>
													<option value="pending">Pending</option>
													<option value="published">Published</option>
												</select>
											) : item.status === "published" ? (
												<span className="px-3 py-1 text-xs rounded-full bg-green-200 text-green-700">
													{item.status}
												</span>
											) : (
												<span className="px-3 py-1 text-xs rounded-full bg-gray-200 text-gray-700">
													{item.status}
												</span>
											)}
										</td>

										<td className="py-4 px-6">
											<div className="flex gap-3 text-gray-500">
												<>
													<Link
														to={`/dashboard/news/edit/${item._id}`}
														className="p-2 rounded-md bg-gray-800 text-white hover:bg-black transition"
													>
														<FaEdit size={14} />
													</Link>
												</>
												{store?.userInfo?.role === "admin" && (
													<button
														onClick={() => handleDeleteNews(item._id)}
														className="cursor-pointer p-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition"
													>
														<FaTrashAlt size={14} />
													</button>
												)}
											</div>
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>
			</div>

			<div className="flex justify-between items-center pt-6 text-sm text-slate-600">
				<div className="flex flex-wrap items-center gap-4">
					<label className="text-sm font-semibold">News Per Page:</label>
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

export default NewsContent;
