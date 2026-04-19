import { isValidLang } from "@/lib/i18n";
import { notFound } from "next/navigation";

export default async function About({
	params,
}: {
	params: Promise<{ lang: string }>;
}) {
	const { lang } = await params;

	if (!isValidLang(lang)) notFound();

	return (
		<main>
			<section className="bg-black text-white py-24 md:py-32 relative overflow-hidden">
				<div className="container mx-auto px-4 relative z-10 text-center">
					<span className="text-red-600 font-black uppercase tracking-[0.4em] text-xs mb-6 block">
						Our Manifesto
					</span>
					<h1 className="text-5xl md:text-8xl font-serif font-black tracking-tighter leading-none mb-8">
						To seek the truth <br /> and report it.
					</h1>
					<p className="max-w-2xl mx-auto text-gray-400 text-lg md:text-xl leading-relaxed">
						Founded in 1998, Global Insight has grown from a small independent
						bureau to a worldwide network of 400+ journalists dedicated to
						fearless, non-partisan reporting.
					</p>
				</div>
				<div className="absolute inset-0 flex items-center justify-center opacity-5 select-none pointer-events-none">
					<span className="text-[40rem] font-black">GI</span>
				</div>
			</section>

			<section className="py-20 bg-gray-50 border-y border-gray-100">
				<div className="container mx-auto px-4">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-12">
						<div className="space-y-4">
							<div className="w-12 h-1 bg-red-600 mb-6"></div>
							<h3 className="text-2xl font-black uppercase italic">
								Independence
							</h3>
							<p className="text-gray-600 leading-relaxed">
								We are beholden to no political party or corporate entity. Our
								funding is transparent, and our editorial board is fully
								autonomous.
							</p>
						</div>
						<div className="space-y-4">
							<div className="w-12 h-1 bg-black mb-6"></div>
							<h3 className="text-2xl font-black uppercase italic">Accuracy</h3>
							<p className="text-gray-600 leading-relaxed">
								Every story undergoes a three-stage fact-checking process. If we
								get it wrong, we correct it prominently and immediately.
							</p>
						</div>
						<div className="space-y-4">
							<div className="w-12 h-1 bg-gray-300 mb-6"></div>
							<h3 className="text-2xl font-black uppercase italic">Humanity</h3>
							<p className="text-gray-600 leading-relaxed">
								We report on policies and data, but we never lose sight of the
								people affected by them. We tell the human story behind the
								headlines.
							</p>
						</div>
					</div>
				</div>
			</section>

			<section className="py-24 container mx-auto px-4">
				<h2 className="text-4xl font-serif font-black text-center mb-16 underline decoration-red-600 decoration-8 underline-offset-8">
					Our Journey
				</h2>

				<div className="max-w-4xl mx-auto space-y-12">
					<div className="flex flex-col md:flex-row gap-8 items-start">
						<div className="md:w-1/4">
							<span className="text-4xl font-black text-gray-200">1998</span>
						</div>
						<div className="md:w-3/4 border-l-2 border-gray-100 pl-8 pb-8">
							<h4 className="text-xl font-bold mb-2 uppercase">
								The First Bureau
							</h4>
							<p className="text-gray-600 italic">
								Global Insight launches in a small rented office in New York
								City with a team of five journalists covering local trade news.
							</p>
						</div>
					</div>
					<div className="flex flex-col md:flex-row gap-8 items-start">
						<div className="md:w-1/4">
							<span className="text-4xl font-black text-gray-200">2012</span>
						</div>
						<div className="md:w-3/4 border-l-2 border-gray-100 pl-8 pb-8">
							<h4 className="text-xl font-bold mb-2 uppercase">
								Going Digital-First
							</h4>
							<p className="text-gray-600 italic">
								We pivot from print-primary to a 24/7 digital-first newsroom,
								opening our London and Tokyo bureaus.
							</p>
						</div>
					</div>
					<div className="flex flex-col md:flex-row gap-8 items-start">
						<div className="md:w-1/4">
							<span className="text-4xl font-black text-red-600">2026</span>
						</div>
						<div className="md:w-3/4 border-l-2 border-red-600 pl-8">
							<h4 className="text-xl font-bold mb-2 uppercase">
								The Global Network
							</h4>
							<p className="text-gray-600 italic">
								Now reaching 50 million readers monthly across 12 languages,
								maintaining our commitment to quality over clickbait.
							</p>
						</div>
					</div>
				</div>
			</section>

			<section className="py-24 bg-gray-900 text-white">
				<div className="container mx-auto px-4">
					<h2 className="text-3xl font-black uppercase tracking-tighter mb-16 text-center">
						Editorial Leadership
					</h2>
					<div className="grid grid-cols-2 md:grid-cols-4 gap-8">
						<div className="text-center group">
							<img
								src="https://i.pravatar.cc/150?u=1"
								className="w-32 h-32 rounded-full mx-auto mb-4 border-2 border-gray-700 group-hover:border-red-600 transition"
							/>
							<h5 className="font-bold uppercase text-sm">Elena Rodriguez</h5>
							<p className="text-xs text-gray-500 mt-1 italic uppercase">
								Editor-in-Chief
							</p>
						</div>
						<div className="text-center group">
							<img
								src="https://i.pravatar.cc/150?u=2"
								className="w-32 h-32 rounded-full mx-auto mb-4 border-2 border-gray-700 group-hover:border-red-600 transition"
							/>
							<h5 className="font-bold uppercase text-sm">Marcus Thorne</h5>
							<p className="text-xs text-gray-500 mt-1 italic uppercase">
								Managing Editor
							</p>
						</div>
						<div className="text-center group">
							<img
								src="https://i.pravatar.cc/150?u=3"
								className="w-32 h-32 rounded-full mx-auto mb-4 border-2 border-gray-700 group-hover:border-red-600 transition"
							/>
							<h5 className="font-bold uppercase text-sm">Sarah Jenkins</h5>
							<p className="text-xs text-gray-500 mt-1 italic uppercase">
								Head of Investigation
							</p>
						</div>
						<div className="text-center group">
							<img
								src="https://i.pravatar.cc/150?u=4"
								className="w-32 h-32 rounded-full mx-auto mb-4 border-2 border-gray-700 group-hover:border-red-600 transition"
							/>
							<h5 className="font-bold uppercase text-sm">David Chen</h5>
							<p className="text-xs text-gray-500 mt-1 italic uppercase">
								Director of Tech
							</p>
						</div>
					</div>
				</div>
			</section>
		</main>
	);
}
