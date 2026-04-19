import { useContext, useState } from "react";
import logo from "../../assets/mainlogo.png";
import { base_url } from "../../config/config";
import axios from "axios";
import toast from "react-hot-toast";
import storeContext from "../../context/storeContext";
import { useNavigate } from "react-router-dom";
import { FaNewspaper, FaLock, FaBolt } from "react-icons/fa";
import decode_token from "../../utils";
const Login = () => {
	const navigate = useNavigate();
	const [loader, setLoader] = useState(false);
	const { dispatch } = useContext(storeContext);
	const [state, setState] = useState({
		email: "",
		password: "",
	});

	const inputHandle = (e) => {
		setState({
			...state,
			[e.target.name]: e.target.value,
		});
	};
	const submit = async (e) => {
		e.preventDefault();
		try {
			const { data } = await axios.post(`${base_url}/api/login`, state);
			setLoader(false);
			localStorage.setItem("newsToken", data.token);
			toast.success(data.message);
			dispatch({
				type: "login_success",
				payload: {
					token: data.token,
				},
			});
			const user = decode_token(data.token);
			console.log(user);
			if (user.role === "admin") {
				navigate("/dashboard/admin");
			} else {
				navigate("/dashboard/writer");
			}
		} catch (error) {
			setLoader(false);
			toast.error(error.response.data.message);
			console.log(error);
		}
	};
	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center px-4">
			<div className="w-full max-w-5xl grid md:grid-cols-2 bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
				{/* LEFT SIDE – Branding */}
				{/* LEFT SIDE – Branding */}
				<div className="hidden md:flex flex-col justify-between bg-gray-900 text-white p-12">
					<div>
						{/* Logo / Brand */}
						<div className="mb-12">
							<h1 className="text-3xl font-bold tracking-wide">Newsroom CMS</h1>
							<p className="text-gray-400 mt-3 text-sm leading-relaxed max-w-sm">
								Editorial management platform for publishing, categorization,
								and newsroom operations.
							</p>
						</div>

						{/* Divider */}
						<div className="w-16 h-[2px] bg-gray-700 mb-12"></div>

						{/* Features Section */}
						<div className="space-y-8">
							<div className="flex items-start gap-4">
								<div className="w-9 h-9 rounded-lg bg-gray-800 flex items-center justify-center text-gray-300">
									<FaNewspaper size={14} />
								</div>
								<div>
									<h4 className="text-sm font-semibold">Editorial Workflow</h4>
									<p className="text-xs text-gray-400 mt-1 leading-relaxed">
										Manage categories, writers and structured publishing.
									</p>
								</div>
							</div>

							<div className="flex items-start gap-4">
								<div className="w-9 h-9 rounded-lg bg-gray-800 flex items-center justify-center text-gray-300">
									<FaLock size={14} />
								</div>
								<div>
									<h4 className="text-sm font-semibold">Secure Access</h4>
									<p className="text-xs text-gray-400 mt-1 leading-relaxed">
										Role-based access with protected administration.
									</p>
								</div>
							</div>

							<div className="flex items-start gap-4">
								<div className="w-9 h-9 rounded-lg bg-gray-800 flex items-center justify-center text-gray-300">
									<FaBolt size={14} />
								</div>
								<div>
									<h4 className="text-sm font-semibold">Fast Publishing</h4>
									<p className="text-xs text-gray-400 mt-1 leading-relaxed">
										Streamlined content management for modern newsrooms.
									</p>
								</div>
							</div>
						</div>
					</div>

					{/* Footer */}
					<div className="pt-12 border-t border-gray-800 text-xs text-gray-500">
						<div>© {new Date().getFullYear()} Your News Network</div>
						<div className="mt-2">Internal Editorial Administration</div>
					</div>
				</div>

				{/* RIGHT SIDE – Login Form */}
				<div className="p-10">
					<div className="flex justify-center mb-8">
						<img className="w-[140px]" src={logo} alt="logo" />
					</div>

					<h2 className="text-2xl font-semibold text-gray-800 text-center">
						Admin/Writer Login
					</h2>
					<p className="text-sm text-gray-500 text-center mt-2 mb-8">
						Enter your credentials to access the dashboard
					</p>

					<form onSubmit={submit} className="space-y-6">
						{/* Email */}
						<div>
							<label
								htmlFor="email"
								className="block text-sm font-medium text-gray-600 mb-2"
							>
								Email Address
							</label>
							<input
								type="email"
								value={state.email}
								onChange={inputHandle}
								name="email"
								id="email"
								placeholder="you@company.com"
								className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none transition text-sm"
							/>
						</div>

						{/* Password */}
						<div>
							<label
								htmlFor="password"
								className="block text-sm font-medium text-gray-600 mb-2"
							>
								Password
							</label>
							<input
								value={state.password}
								onChange={inputHandle}
								type="password"
								name="password"
								id="password"
								placeholder="Enter your password"
								className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none transition text-sm"
							/>
						</div>

						{/* Submit */}
						<div>
							<button
								type="submit"
								disabled={loader}
								className={`cursor-pointer w-full py-3 rounded-lg font-semibold text-sm transition ${
									loader
										? "bg-gray-400 cursor-not-allowed text-white"
										: "bg-gray-900 hover:bg-black text-white"
								}`}
							>
								{loader ? (
									<span className="flex justify-center items-center gap-2">
										<span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
										Signing In...
									</span>
								) : (
									"Sign In"
								)}
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default Login;
