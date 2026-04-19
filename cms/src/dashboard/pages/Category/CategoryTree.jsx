import { DndContext, closestCenter } from "@dnd-kit/core";
import {
	SortableContext,
	useSortable,
	verticalListSortingStrategy,
	arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { FaChevronRight, FaChevronDown } from "react-icons/fa";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { FaGripVertical } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { base_url } from "../../../config/config";
import storeContext from "../../../context/storeContext";

// 🔹 Sortable Item Component
const SortableItem = ({ node, level, onDelete, expanded, toggleExpand }) => {
	const { attributes, listeners, setNodeRef, transform, transition } =
		useSortable({ id: node._id });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	const isExpanded = expanded[node._id];

	return (
		<li ref={setNodeRef} style={style} {...attributes}>
			<div
				className="flex justify-between items-center py-3 px-4 rounded-lg hover:bg-gray-50 bg-white border border-transparent hover:border-gray-200 transition"
				style={{ marginLeft: `${level * 20}px` }}
			>
				<div className="flex items-center gap-3">
					{/* Drag */}
					<span
						{...listeners}
						className="cursor-move text-gray-400 hover:text-gray-700"
					>
						<FaGripVertical size={14} />
					</span>

					{/* Expand */}
					{node.children.length > 0 ? (
						<button
							type="button"
							onClick={() => toggleExpand(node._id)}
							className="text-gray-500"
						>
							{isExpanded ? (
								<FaChevronDown size={12} />
							) : (
								<FaChevronRight size={12} />
							)}
						</button>
					) : (
						<span className="w-[14px]" />
					)}

					{/* Name */}
					<span className="font-medium text-gray-800">
						{node.contentLang === "en" ? node.name : node.nameRegional}
					</span>

					{/* Badges */}
					<span
						className={`text-xs px-2 py-0.5 rounded-full ${
							node.isActive
								? "bg-green-100 text-green-700"
								: "bg-red-100 text-gray-600"
						}`}
					>
						<b>Status</b>: {node.isActive ? "Active" : "Inactive"}
					</span>

					<span
						className={`text-xs px-2 py-0.5 rounded-full ${
							node.showInMenu
								? "bg-blue-100 text-green-700"
								: "bg-gray-200 text-gray-600"
						}`}
					>
						<b>Show In Menu</b>: {node.showInMenu ? "Active" : "Inactive"}
					</span>

					<span
						className={`text-xs px-2 py-0.5 rounded-full ${
							node.showInHomePage
								? "bg-blue-100 text-green-700"
								: "bg-gray-200 text-gray-600"
						}`}
					>
						<b>Show In Home Page</b>: {node.showInHomePage ? "Active" : "Inactive"}
					</span>
				</div>

				{/* Actions */}
				<div className="flex items-center gap-2">
					<Link
						to={`/dashboard/categories/edit/${node._id}`}
						className="p-2 rounded-md bg-gray-900 text-white hover:bg-black transition"
					>
						<FaEdit size={14} />
					</Link>

					<button
						onClick={() => onDelete(node._id)}
						className="cursor-pointer p-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition"
					>
						<FaTrashAlt size={14} />
					</button>
				</div>
			</div>

			{/* Children */}
			{node.children.length > 0 && isExpanded && (
				<CategoryTree
					nodes={node.children}
					level={level + 1}
					onDelete={onDelete}
					expanded={expanded}
					toggleExpand={toggleExpand}
				/>
			)}
		</li>
	);
};

// 🔹 Main Tree Component
const CategoryTree = ({
	nodes,
	level = 0,
	onDelete,
	expanded,
	toggleExpand,
	contentLangFilter
}) => {
	const { store } = useContext(storeContext);
	const queryClient = useQueryClient();
	const [items, setItems] = useState(nodes);
	useEffect(() => {
		setItems(nodes);
	}, [nodes]);

	const handleDragEnd = async (event) => {
		const { active, over } = event;

		if (!over || active.id === over.id) return;
		if (saveOrderMutation.isPending) return; // prevent multiple calls

		const oldIndex = items.findIndex((i) => i._id === active.id);
		const newIndex = items.findIndex((i) => i._id === over.id);

		const newItems = arrayMove(items, oldIndex, newIndex);

		const updated = newItems.map((item, index) => ({
			...item,
			order: index,
		}));

		setItems(updated);

		saveOrderMutation.mutate(updated, {
			onError: () => {
				setItems(items); // rollback
			},
		});
	};
	/* const saveOrder = async (items) => {
		try {
			const { data } = await axios.put(
				`${base_url}/api/categories/reorder`,
				items.map((i) => ({
					_id: i._id,
					order: i.order,
				})),
				{
					headers: {
						Authorization: `Bearer ${store.token}`,
					},
				}
			);
			toast.success(data.message);
		} catch (error) {
			console.error("Order save failed", error);
		}
	}; */
	const saveOrderMutation = useMutation({
		mutationFn: async (items) => {
			const { data } = await axios.put(
				`${base_url}/api/categories/reorder`,
				items.map((i) => ({
					_id: i._id,
					order: i.order,
				})),
				{
					headers: {
						Authorization: `Bearer ${store.token}`,
					},
				}
			);
			return data;
		},
		onSuccess: (data) => {
			toast.success(data.message);
			queryClient.invalidateQueries({
				queryKey: ["categories", contentLangFilter],
			});
		},
		onError: (err) => {
			toast.error(err.response?.data?.message || "Order save failed");
		},
	});

	return (
		<DndContext
			collisionDetection={closestCenter}
			onDragEnd={handleDragEnd}
			disabled={saveOrderMutation.isPending}
		>
			<SortableContext
				items={items.map((i) => i._id)}
				strategy={verticalListSortingStrategy}
			>
				{saveOrderMutation.isPending && (
					<div className="flex items-center gap-2 text-sm text-blue-600 mb-2">
						<svg
							className="animate-spin h-4 w-4"
							viewBox="0 0 24 24"
							fill="none"
						>
							<circle
								className="opacity-25"
								cx="12"
								cy="12"
								r="10"
								stroke="currentColor"
								strokeWidth="4"
							/>
							<path
								className="opacity-75"
								fill="currentColor"
								d="M4 12a8 8 0 018-8v8H4z"
							/>
						</svg>
						Saving order...
					</div>
				)}
				<ul className="space-y-1">
					{items.map((node) => (
						<SortableItem
							key={node._id}
							node={node}
							level={level}
							onDelete={onDelete}
							expanded={expanded}
							toggleExpand={toggleExpand}
						/>
					))}
				</ul>
			</SortableContext>
		</DndContext>
	);
};

export default CategoryTree;
