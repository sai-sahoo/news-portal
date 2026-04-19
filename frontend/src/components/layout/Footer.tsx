import BigBreaking from "../home/BigBreaking";
import Link from "next/link";
import { Lang } from "@/lib/i18n";

type FooterProps = {
  lang: Lang;
};
export default function Footer({ lang }: FooterProps) {
	return (
		<>
			<footer className="bg-gray-900 text-white pt-16 pb-8">
				<div className="container mx-auto px-4">
					<div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 mb-16">
						<div className="col-span-2">
							<h2 className="text-3xl font-black tracking-tighter mb-4">
								FAST MAIL
							</h2>
							<p className="text-gray-400 text-sm leading-relaxed pr-8">
								Reporting with integrity, accuracy, and depth. We provide
								context to the chaos of the daily news cycle.
							</p>
						</div>
						<div>
							<h5 className="font-bold text-sm mb-4 uppercase text-red-500">
								Categories
							</h5>
							<ul className="text-sm text-gray-400 space-y-2">
								<li>
									<a href="#" className="hover:text-white">
										World
									</a>
								</li>
								<li>
									<a href="#" className="hover:text-white">
										Politics
									</a>
								</li>
								<li>
									<a href="#" className="hover:text-white">
										Tech
									</a>
								</li>
							</ul>
						</div>
						<div>
							<h5 className="font-bold text-sm mb-4 uppercase text-red-500">
								Company
							</h5>
							<ul className="text-sm text-gray-400 space-y-2">
								<li>
									<Link href={`/${lang}/about`} className="hover:text-white">
										About
									</Link>
								</li>
								<li>
									<Link href={`/${lang}/contact`} className="hover:text-white">
										Contact
									</Link>
								</li>
								<li>
									<Link
										href={`/${lang}/privacy-policy`}
										className="hover:text-white"
									>
										Terms & Privacy
									</Link>
								</li>
							</ul>
						</div>
						<div className="col-span-2">
							<h5 className="font-bold text-sm mb-4 uppercase text-red-500">
								Newsletter
							</h5>
							<div className="flex">
								<input
									type="email"
									placeholder="Your email"
									className="bg-gray-800 border-none px-4 py-2 text-sm w-full focus:ring-1 focus:ring-red-500"
								/>
								<button className="bg-red-600 px-4 py-2 text-xs font-bold uppercase tracking-widest">
									Join
								</button>
							</div>
						</div>
					</div>
					<div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-[10px] text-gray-500 uppercase tracking-widest font-bold">
						<p>
							&copy; 2026 Global Insight News Media Group. All Rights Reserved.
						</p>
						<div className="flex space-x-6 mt-4 md:mt-0">
							<Link href={`/${lang}/about`} className="hover:text-white">
								About
							</Link>
							<Link href={`/${lang}/contact`} className="hover:text-white">
								Contact
							</Link>
							<Link
								href={`/${lang}/privacy-policy`}
								className="hover:text-white"
							>
								Terms & Privacy
							</Link>
						</div>
					</div>
				</div>
			</footer>
			<div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3 z-100 flex justify-between items-center shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
				<a href="#" className="flex flex-col items-center gap-1 text-red-600">
					<i className="fas fa-home text-lg"></i>
					<span className="text-[10px] font-bold uppercase">Home</span>
				</a>
				<a
					href="#"
					className="flex flex-col items-center gap-1 text-gray-400 hover:text-black"
				>
					<i className="fas fa-layer-group text-lg"></i>
					<span className="text-[10px] font-bold uppercase">Sections</span>
				</a>
				<a
					href="#"
					className="flex flex-col items-center gap-1 text-gray-400 hover:text-black"
				>
					<i className="fas fa-search text-lg"></i>
					<span className="text-[10px] font-bold uppercase">Search</span>
				</a>
				<a
					href="#"
					className="flex flex-col items-center gap-1 text-gray-400 hover:text-black"
				>
					<i className="fas fa-bookmark text-lg"></i>
					<span className="text-[10px] font-bold uppercase">Saved</span>
				</a>
				<a
					href="#"
					className="flex flex-col items-center gap-1 text-gray-400 hover:text-black"
				>
					<i className="fas fa-user-circle text-lg"></i>
					<span className="text-[10px] font-bold uppercase">Account</span>
				</a>
			</div>

			<div className="lg:hidden h-20"></div>
			<BigBreaking />
		</>
	);
}
