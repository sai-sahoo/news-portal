"use client";

import { useState } from "react";
import Link from "next/link";
import { Lang } from "@/lib/i18n";
import { ChevronDown, ChevronRight } from "lucide-react";

type CategoryNode = {
	_id: string;
	name: string;
	nameRegional: string;
	slug: string;
	children: CategoryNode[];
};

export default function CategoryClient({
	tree,
	lang,
}: {
	tree: CategoryNode[];
	lang: Lang;
}) {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<>
			{/* MOBILE BUTTON */}
			<button className="text-xl lg:hidden" onClick={() => setIsOpen(true)}>
				☰
			</button>

			{/* DESKTOP NAV */}
			<nav className="hidden lg:block border-t border-gray-100 bg-white">
				<div className="container mx-auto px-4">
					<ul className="flex space-x-8 py-3 text-xs font-black uppercase justify-center tracking-wider">
						{tree.map((cat) => (
							<li key={cat._id} className="group relative py-2 px-1">
								<Link
									href={`/${lang}/${cat.slug}`}
									className="flex items-center whitespace-nowrap"
								>
									{cat.nameRegional || cat.name}
									{cat.children.length > 0 && (
										<ChevronDown size={14} className="ml-1" />
									)}
								</Link>

								{/* MEGA MENU */}
								{cat.children.length > 0 && (
									<div className="absolute left-0 top-full w-screen max-w-5xl bg-white shadow-2xl border border-gray-200 opacity-0 invisible group-hover:visible group-hover:opacity-100 transition-all duration-300 ease-out translate-y-4 group-hover:translate-y-0 z-50">
										<div className="grid grid-cols-3 gap-6 p-6">
											{cat.children.map((child) => (
												<div key={child._id}>
													{/* CHILD LEVEL */}
													<Link
														href={`/${lang}/${child.slug}`}
														className="flex items-center justify-between font-bold mb-2 hover:text-red-600"
													>
														{child.nameRegional || child.name}

														{child.children.length > 0 && (
															<ChevronRight size={12} className="ml-2" />
														)}
													</Link>

													{/* SUB CHILDREN */}
													{child.children.length > 0 && (
														<ul className="space-y-1 text-gray-600 normal-case font-medium">
															{child.children.map((sub) => (
																<li key={sub._id}>
																	<Link
																		href={`/${lang}/${sub.slug}`}
																		className="flex items-center justify-between hover:text-red-600"
																	>
																		{sub.nameRegional || sub.name}

																		{sub.children?.length > 0 && (
																			<i className="fas fa-chevron-right text-[10px] ml-2"></i>
																		)}
																	</Link>
																</li>
															))}
														</ul>
													)}
												</div>
											))}
										</div>
									</div>
								)}
							</li>
						))}
					</ul>
				</div>
			</nav>

			{/* MOBILE DRAWER */}
			{isOpen && (
				<div className="fixed inset-0 bg-black/50 z-[100]">
					<div className="bg-white w-72 min-h-full p-6 shadow-xl relative">
						{/* CLOSE BUTTON */}
						<button
							className="absolute top-4 right-4 text-2xl"
							onClick={() => setIsOpen(false)}
						>
							×
						</button>

						<ul className="mt-10 space-y-2">
							<MobileMenu
								tree={tree}
								lang={lang}
								close={() => setIsOpen(false)}
							/>
						</ul>
					</div>
				</div>
			)}
		</>
	);
}

function MobileMenu({
	tree,
	lang,
	close,
}: {
	tree: CategoryNode[];
	lang: Lang;
	close: () => void;
}) {
	return (
		<>
			{tree.map((cat) => (
				<li key={cat._id}>
					{cat.children.length > 0 ? (
						<details>
							<summary className="cursor-pointer py-2">
								{cat.nameRegional || cat.name}
							</summary>

							<ul className="pl-4 mt-2">
								<MobileMenu tree={cat.children} lang={lang} close={close} />
							</ul>
						</details>
					) : (
						<Link
							href={`/${lang}/${cat.slug}`}
							onClick={close}
							className="block py-2"
						>
							{cat.nameRegional || cat.name}
						</Link>
					)}
				</li>
			))}
		</>
	);
}

function DesktopSubMenu({
	items,
	lang,
}: {
	items: CategoryNode[];
	lang: Lang;
}) {
	return (
		<>
			{items.map((cat) => (
				<li key={cat._id} className="relative group">
					<Link
						href={`/${lang}/${cat.slug}`}
						className="block px-4 py-2 hover:text-red-600 whitespace-nowrap"
					>
						{cat.nameRegional || cat.name}
					</Link>

					{/* NESTED DROPDOWN */}
					{cat.children.length > 0 && (
						<ul className="absolute left-full top-0 hidden group-hover:block bg-white border border-gray-200 shadow-xl min-w-[220px] z-50">
							<DesktopSubMenu items={cat.children} lang={lang} />
						</ul>
					)}
				</li>
			))}
		</>
	);
}
