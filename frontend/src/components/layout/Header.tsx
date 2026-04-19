import Category from "../home/CategoryServer";
import { Lang } from "@/lib/i18n";
import LanguageSwitcher from "./LanguageSwitcher";
type HeaderProps = {
  lang: Lang;
};
export default function Header({ lang }: HeaderProps) {
	return (
		<header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
			<div className="container mx-auto px-4 py-4 flex justify-between items-center">
				<div className="flex items-center space-x-4">
					
					<div className="hidden lg:block text-xs font-bold text-gray-400 uppercase tracking-widest">
						Friday, Mar 20, 2026
					</div>
				</div>
				<h1 className="text-3xl md:text-5xl font-black tracking-tighter uppercase font-serif">
					FAST MAIL
				</h1>
				<div className="flex items-center space-x-6">
					<LanguageSwitcher lang={lang} />
					{/* <button className="hidden md:block border-2 border-black px-4 py-1 text-xs font-black hover:bg-black hover:text-white transition">
						LOGIN
					</button>
					<button className="bg-red-600 text-white px-4 py-1.5 text-xs font-black rounded shadow-lg">
						SUBSCRIBE
					</button> */}
				</div>
			</div>
			<Category lang={lang} />
		</header>
	);
}
