import { isValidLang, Lang } from "@/lib/i18n";
import { notFound } from "next/navigation";
import { getCategoryBySlug } from "@/lib/api/category";
import Link from "next/link";

type PageProps = {
	params: Promise<{
		lang: Lang;
		categorySlug: string;
		newsSlug: string;
	}>;
};

type CatNewsType = {
	_id: string;
	title: string;
    titleRegional: string;
	slug: string;
	image: string;
	createdAt: string;
};

type NewsType = {
	writerName: string;
	title: string;
    titleRegional: string;
	description: string;
	image: string;
	createdAt: string;
	author?: string;
};

export default async function NewsDetailsPage({ params }: PageProps) {
	const { lang, categorySlug, newsSlug } = await params;

	if (!isValidLang(lang)) notFound();
	const categoryRes = await getCategoryBySlug(categorySlug, lang);
	if (!categoryRes?.data) notFound();
	const categoryDetails = categoryRes.data;

	const cateNewsRes = await fetch(
		`http://localhost:5000/api/public/news/category/${categorySlug}?lang=${lang}`,
		{ cache: "no-store" }
	);
	const cateNewsResData = await cateNewsRes.json();
	const cateNewsData: CatNewsType[] = cateNewsResData.data;

	const newsDetailsRes = await fetch(
		`${process.env.NEXT_PUBLIC_API_URL}/news/${newsSlug}?lang=${lang}`,
		{ cache: "no-store" }
	);
	if (!newsDetailsRes.ok) {
		notFound();
	}
	const result = await newsDetailsRes.json();
	const news: NewsType = result.data;

	return (
		<>
			<main className="container mx-auto px-4 py-8">
				<div className="max-w-4xl mx-auto text-center mb-10">
					<a
						href="#"
						className="text-red-600 font-black text-xs uppercase tracking-widest hover:underline"
					>
						{categoryDetails.nameRegional || categoryDetails.name}
					</a>
					<h1 className="text-4xl md:text-6xl font-serif font-black mt-4 mb-6 leading-tight">
						{news.titleRegional || news.title}
					</h1>
					<p className="text-xl md:text-2xl text-gray-500 font-serif italic leading-relaxed">
						{news.titleRegional || news.title}
					</p>

					<div className="flex items-center justify-center gap-4 mt-8 pt-8 border-t border-gray-100">
						<img
							src="https://i.pravatar.cc/100?img=5"
							className="w-12 h-12 rounded-full border border-gray-200"
						/>
						<div className="text-left">
							<p className="text-sm font-black uppercase">{news.writerName}</p>
							<p className="text-xs text-gray-400">
								{new Date(news.createdAt).toLocaleDateString()}
							</p>
						</div>
						<div className="ml-auto flex gap-3 text-gray-400">
							<i className="fab fa-facebook-f hover:text-blue-600 cursor-pointer"></i>
							<i className="fab fa-x-twitter hover:text-black cursor-pointer"></i>
							<i className="fas fa-bookmark hover:text-red-600 cursor-pointer"></i>
						</div>
					</div>
				</div>

				<div className="w-full max-w-6xl mx-auto mb-12">
					<figure>
						<img
							src={news.image}
							alt={news.title}
							className="w-full h-100 object-cover rounded-lg mb-6"
						/>
						<figcaption className="hidden text-xs text-gray-400 mt-3 italic text-right">
							Photo by Markus Spiske via Unsplash / Port of Rotterdam Operations
						</figcaption>
					</figure>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-6xl mx-auto">
					<article className="lg:col-span-8">
						<div
							className="prose prose-lg max-w-none text-gray-800 leading-relaxed font-serif text-xl"
							dangerouslySetInnerHTML={{ __html: news.description || "" }}
						/>
						<div className="mt-12 flex flex-wrap gap-2 pt-8 border-t border-gray-100">
							<span className="bg-gray-100 px-3 py-1 text-xs font-bold uppercase hover:bg-red-600 hover:text-white cursor-pointer transition">
								Economy
							</span>
							<span className="bg-gray-100 px-3 py-1 text-xs font-bold uppercase hover:bg-red-600 hover:text-white cursor-pointer transition">
								Trade
							</span>
							<span className="bg-gray-100 px-3 py-1 text-xs font-bold uppercase hover:bg-red-600 hover:text-white cursor-pointer transition">
								Politics
							</span>
						</div>
					</article>

					<aside className="lg:col-span-4 space-y-12">
						<div className="bg-gray-50 p-6">
							<h3 className="font-black text-sm uppercase border-b-2 border-black mb-6 pb-2">
								Trending News
							</h3>
							<ul className="space-y-6">
								<li className="flex gap-4 items-start">
									<span className="text-2xl font-serif text-gray-300 font-black">
										01
									</span>
									<a
										href="#"
										className="font-bold text-sm hover:text-red-600 transition"
									>
										Tech giants announce new privacy standards for 2027.
									</a>
								</li>
								<li className="flex gap-4 items-start">
									<span className="text-2xl font-serif text-gray-300 font-black">
										02
									</span>
									<a
										href="#"
										className="font-bold text-sm hover:text-red-600 transition"
									>
										The hidden costs of remote work on city infrastructure.
									</a>
								</li>
								<li className="flex gap-4 items-start">
									<span className="text-2xl font-serif text-gray-300 font-black">
										03
									</span>
									<a
										href="#"
										className="font-bold text-sm hover:text-red-600 transition"
									>
										How to secure your digital assets in the AI era.
									</a>
								</li>
							</ul>
						</div>
						<div className="bg-white border-2 border-black p-6 shadow-[8px_8px_0px_#000] max-w-sm mx-auto my-8">
							<div className="flex items-center gap-2 mb-4">
								<span className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
								<span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
									Daily Reader Poll
								</span>
							</div>

							<h3 className="text-xl font-serif font-black leading-tight mb-6">
								Do you believe Central Banks should regulate Decentralized
								Finance (DeFi)?
							</h3>

							<form id="poll-form" className="space-y-3">
								<label className="poll-option group block relative border border-gray-200 p-4 cursor-pointer hover:border-black transition-all">
									<input
										type="radio"
										name="poll"
										value="yes"
										className="absolute inset-0 opacity-0 z-20 cursor-pointer"
									/>

									<div className="flex justify-between items-center relative z-10 pointer-events-none">
										<span className="text-sm font-bold uppercase tracking-tight group-hover:text-red-600">
											Yes, strictly.
										</span>
										<span className="results-pct hidden font-mono font-bold text-red-600">
											62%
										</span>
									</div>
									<div
										className="results-bar absolute inset-0 bg-red-50 origin-left scale-x-0 transition-transform duration-1000 pointer-events-none"
										style={{ width: "62%" }}
									></div>
								</label>

								<label className="poll-option group block relative border border-gray-200 p-4 cursor-pointer hover:border-black transition-all">
									<input
										type="radio"
										name="poll"
										value="no"
										className="absolute inset-0 opacity-0 z-20 cursor-pointer"
									/>

									<div className="flex justify-between items-center relative z-10 pointer-events-none">
										<span className="text-sm font-bold uppercase tracking-tight group-hover:text-red-600">
											No, let it evolve.
										</span>
										<span className="results-pct hidden font-mono font-bold text-red-600">
											28%
										</span>
									</div>
									<div
										className="results-bar absolute inset-0 bg-red-50 origin-left scale-x-0 transition-transform duration-1000 pointer-events-none"
										style={{ width: "28%" }}
									></div>
								</label>

								<label className="poll-option group block relative border border-gray-200 p-4 cursor-pointer hover:border-black transition-all">
									<input
										type="radio"
										name="poll"
										value="unsure"
										className="absolute inset-0 opacity-0 z-20 cursor-pointer"
									/>

									<div className="flex justify-between items-center relative z-10 pointer-events-none">
										<span className="text-sm font-bold uppercase tracking-tight group-hover:text-red-600">
											Unsure / No opinion.
										</span>
										<span className="results-pct hidden font-mono font-bold text-red-600">
											10%
										</span>
									</div>
									<div
										className="results-bar absolute inset-0 bg-red-50 origin-left scale-x-0 transition-transform duration-1000 pointer-events-none"
										style={{ width: "10%" }}
									></div>
								</label>

								<button
									type="submit"
									className="w-full bg-black text-white font-black uppercase text-xs py-4 mt-4 tracking-widest hover:bg-red-600 transition shadow-lg"
								>
									Cast Your Vote
								</button>
							</form>

							<p
								id="poll-total"
								className="text-[10px] text-gray-400 font-bold uppercase mt-6 text-center tracking-widest"
							>
								Total Votes: 12,402 • Poll closes in 4 hours
							</p>
						</div>

						<div className="sticky top-24">
							<div className="bg-gray-100 w-full h-150 flex flex-col items-center justify-center text-gray-400 border border-gray-200">
								<span className="text-xs mb-2">ADVERTISEMENT</span>
								<div className="text-center p-4">
									<p className="font-bold text-gray-600">
										300 x 600 Half Page Ad
									</p>
								</div>
							</div>
						</div>
					</aside>
				</div>

				<section className="mt-20 pt-12 border-t border-black">
					<h2 className="text-3xl font-black uppercase mb-10 tracking-tighter">
						Related Stories
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						{cateNewsData.map((item) => {
							return (
								<div key={item._id} className="group cursor-pointer">
									<Link href={`/${lang}/${categorySlug}/${item.slug}`}>
										<img
											src={item.image}
											alt={item.title}
											className="w-full h-48 object-cover mb-4"
										/>
										<h4 className="font-bold text-lg group-hover:text-red-600 leading-tight">
                                            {item.titleRegional || item.title}
										</h4>
									</Link>
								</div>
							);
						})}
					</div>
				</section>
			</main>
		</>
	);
}
