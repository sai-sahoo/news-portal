import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
// import { useIsFetching, useIsMutating } from "@tanstack/react-query";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
	const [collapsed, setCollapsed] = useState(false);
	// const isFetching = useIsFetching();
	// const isMutating = useIsMutating();
	// const isLoading = isFetching > 0 || isMutating > 0;

	return (
		<div className="min-h-screen bg-slate-100 flex overflow-hidden">
			{/* Sidebar */}
			<div
				className={`transition-all duration-300 ${
					collapsed ? "w-[80px]" : "w-[250px]"
				}`}
			>
				<Sidebar collapsed={collapsed} />
			</div>

			{/* Main Area */}
			<div className="flex-1 min-w-0 flex flex-col">
				{/* Header */}
				<Header collapsed={collapsed} toggle={() => setCollapsed(!collapsed)} />

				{/* Page Content */}
				<main className="p-8 mt-[70px] overflow-x-hidden">
					<div className="relative bg-white border border-slate-200 p-8 min-h-[calc(100vh-120px)]">
						{/* 🔥 Content Loader */}
						{/* {isLoading && (
							<div className="absolute inset-0 z-40 flex items-center justify-center bg-white/70 backdrop-blur-sm">
								<div className="w-10 h-10 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin"></div>
							</div>
						)} */}

						<Outlet />
					</div>
				</main>
			</div>
		</div>
	);
};

export default MainLayout;
