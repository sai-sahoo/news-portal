import { useContext } from "react";
import { FaBars } from "react-icons/fa";
import profile from "../../assets/profile.png";
import storeContext from "../../context/storeContext";

const Header = ({ collapsed, toggle }) => {
	const { store } = useContext(storeContext);

	return (
		<header
			className={`h-[70px] fixed top-0 right-0 bg-white border-b border-slate-200 flex items-center justify-between px-8 z-40 transition-all duration-300 ${
				collapsed ? "left-[80px]" : "left-[250px]"
			}`}
		>
			{/* Left Section */}
			<div className="flex items-center gap-4">
				<button
					onClick={toggle}
					className="cursor-pointer p-2 rounded-md hover:bg-slate-100 transition"
				>
					<FaBars />
				</button>

				{/* <input
					type="text"
					placeholder="Search..."
					className="w-[300px] px-3 py-2 text-sm border border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-500"
				/> */}
			</div>

			{/* Right Section */}
			<div className="flex items-center gap-3">
				<div className="text-right">
					<p className="text-sm font-semibold text-slate-800">
						{store.userInfo?.name}
					</p>
					<p className="text-xs text-slate-500 capitalize">
						{store.userInfo?.role}
					</p>
				</div>

				<img
					className="w-9 h-9 border border-slate-300 rounded-full"
					src={profile}
					alt="profile"
				/>
			</div>
		</header>
	);
};

export default Header;
