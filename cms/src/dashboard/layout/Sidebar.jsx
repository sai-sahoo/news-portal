import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../../assets/mainlogo.png";
import { MdCategory, MdDashboard, MdOutlineCampaign, MdKeyboardArrowDown } from "react-icons/md";
import { BiNews } from "react-icons/bi";
import { PiUsersFill } from "react-icons/pi";
import { FaHouseUser, FaPoll } from "react-icons/fa";
import { TbReplace } from "react-icons/tb";
import { RiAdvertisementFill, RiCreativeCommonsNcFill, RiAdvertisementLine } from "react-icons/ri";
import { IoShareOutline } from "react-icons/io5";
import { useContext, useState } from "react";
import storeContext from "../../context/storeContext";

const Sidebar = ({ collapsed }) => {
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const { store, dispatch } = useContext(storeContext);
    
    // State to handle the Ads dropdown
    const [adsOpen, setAdsOpen] = useState(false);

    const logout = () => {
        localStorage.removeItem("newsToken");
        dispatch({
            type: "logout",
            payload: "",
        });
        navigate("/login");
    };

    const MenuItem = ({ to, icon, label, isButton, onClick, hasSubmenu, isOpen }) => {
        const isActive = pathname === to;

        const baseClasses =
            "relative group flex items-center gap-3 px-4 py-3 text-sm transition rounded-md";

        const activeClasses = isActive
            ? "bg-slate-800 text-white"
            : "text-slate-300 hover:bg-slate-800 hover:text-white";

        const content = (
            <>
                {isActive && (
                    <span className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-r"></span>
                )}

                <span className="text-[20px]">{icon}</span>

                {!collapsed && <span className="flex-grow">{label}</span>}
                
                {!collapsed && hasSubmenu && (
                    <MdKeyboardArrowDown className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
                )}

                {collapsed && (
                    <div
                        className="absolute left-full ml-6 w-auto px-2 py-1 bg-slate-800 text-white text-xs rounded-md 
                    opacity-0 invisible group-hover:opacity-100 group-hover:visible 
                    transition-all duration-200 whitespace-nowrap z-[9999] shadow-lg border border-slate-700"
                    >
                        {label}
                        <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-slate-800 rotate-45"></div>
                    </div>
                )}
            </>
        );

        if (isButton || hasSubmenu) {
            return (
                <button
                    onClick={onClick}
                    className={`${baseClasses} ${activeClasses} w-full cursor-pointer text-left`}
                >
                    {content}
                </button>
            );
        }

        return (
            <Link to={to} className={`${baseClasses} ${activeClasses}`}>
                {content}
            </Link>
        );
    };

    return (
        <div
            className={`fixed left-0 top-0 h-screen bg-slate-900 transition-all duration-300 z-40 ${
                collapsed ? "w-[80px]" : "w-[250px]"
            }`}
        >
            <div className="h-[70px] flex items-center justify-center border-b border-slate-800">
                <Link to="/">
                    <img
                        className={`transition-all duration-300 ${
                            collapsed ? "w-[40px]" : "w-[190px]"
                        }`}
                        src={logo}
                        alt="logo"
                    />
                </Link>
            </div>

            <ul className="px-3 flex flex-col gap-y-1 font-medium mt-4">
                {store.userInfo.role === "admin" ? (
                    <>
                        <li>
                            <MenuItem
                                to="/dashboard/admin"
                                icon={<MdDashboard />}
                                label="Dashboard"
                            />
                        </li>
                        <li>
                            <MenuItem
                                to="/dashboard/writers"
                                icon={<PiUsersFill />}
                                label="Writers"
                            />
                        </li>
                        <li>
                            <MenuItem
                                to="/dashboard/categories"
                                icon={<MdCategory />}
                                label="Categories"
                            />
                        </li>
                        <li>
                            <MenuItem to="/dashboard/polls" icon={<FaPoll />} label="Polls" />
                        </li>

                        {/* --- AD MANAGEMENT DROPDOWN --- */}
                        <li>
                            <MenuItem 
                                icon={<RiAdvertisementLine />} 
                                label="Manage Ads" 
                                hasSubmenu 
                                isOpen={adsOpen}
                                onClick={() => setAdsOpen(!adsOpen)}
                            />
                            <div className={`overflow-hidden transition-all duration-300 ${adsOpen && !collapsed ? "max-h-60 mt-1" : "max-h-0"}`}>
                                <ul className="flex flex-col gap-y-1 pl-4 border-l border-slate-700 ml-6">
                                    <li>
                                        <MenuItem to="/dashboard/ads/placements" icon={<TbReplace />} label="Placements" />
                                    </li>
                                    <li>
                                        <MenuItem to="/dashboard/ads/advertisers" icon={<RiAdvertisementFill />} label="Advertisers" />
                                    </li>
                                    <li>
                                        <MenuItem to="/dashboard/ads/campaigns" icon={<MdOutlineCampaign />} label="Campaigns" />
                                    </li>
                                    <li>
                                        <MenuItem to="/dashboard/ads/creatives" icon={<RiCreativeCommonsNcFill />} label="Creatives" />
                                    </li>
                                </ul>
                            </div>
                        </li>
                        {/* ------------------------------ */}
                    </>
                ) : (
                    <>
                        <li>
                            <MenuItem
                                to="/dashboard/writer"
                                icon={<MdDashboard />}
                                label="Dashboard"
                            />
                        </li>
                    </>
                )}

                <li>
                    <MenuItem to="/dashboard/news" icon={<BiNews />} label="News" />
                </li>

                <li>
                    <MenuItem
                        to="/dashboard/profile"
                        icon={<FaHouseUser />}
                        label="Profile"
                    />
                </li>

                <li>
                    <MenuItem
                        icon={<IoShareOutline />}
                        label="Logout"
                        isButton
                        onClick={logout}
                    />
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;