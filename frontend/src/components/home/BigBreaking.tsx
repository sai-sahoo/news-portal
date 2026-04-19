export default function BigBreaking() {
	return (
		<div
			id="big-breaking-bar"
			className="fixed bottom-0 left-0 right-0 z-[150] transform translate-y-0 transition-transform duration-500"
		>
			<div className="bg-black text-white flex flex-col md:flex-row items-center">
				<div className="bg-red-600 px-6 py-4 flex items-center gap-3 animate-pulse">
					<span className="relative flex h-3 w-3">
						<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
						<span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
					</span>
					<span className="font-black uppercase tracking-[0.2em] text-sm whitespace-nowrap">
						Big Breaking
					</span>
				</div>

				<div className="flex-grow px-6 py-4 flex items-center justify-between overflow-hidden">
					<div className="flex items-center gap-4">
						<span className="hidden md:block text-gray-500 font-mono text-xs">
							20:30 IST
						</span>
						<p className="font-serif italic text-lg md:text-xl truncate tracking-tight">
							Global Markets Suspend Trading Amid Unprecedented Currency
							Fluctuations
						</p>
					</div>

					<div className="flex items-center gap-6 ml-4">
						<a
							href="article.html"
							className="hidden sm:block text-[10px] font-black uppercase border-b border-white hover:text-red-500 hover:border-red-500 transition whitespace-nowrap"
						>
							Developments <i className="fas fa-arrow-right ml-1"></i>
						</a>
						<button
							id="close-breaking"
							className="text-gray-400 hover:text-white transition p-1"
						>
							<i className="fas fa-times"></i>
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
