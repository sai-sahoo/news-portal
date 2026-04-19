const AuthLoading = () => {
	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-100">
			<div className="flex flex-col items-center gap-4">
				<div className="w-10 h-10 border-4 border-gray-800 border-t-transparent rounded-full animate-spin"></div>
				<div className="text-2xl font-semibold text-gray-800">Newsroom CMS</div>
				<p className="text-sm text-gray-600">Initializing session...</p>
			</div>
		</div>
	);
};

export default AuthLoading;
