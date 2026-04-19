import { isValidLang, Lang } from "@/lib/i18n";
import Link from "next/link";
import { notFound } from "next/navigation";

type LangProps = {
	lang: Lang;
};
type NewsType = {
	_id: string;
	categorySlug: string;
	categoryName: string;
	categoryNameRegional: string;
	title: string;
	titleRegional: string;
	metaDescription: string;
	slug: string;
	image: string;
	writerName?: string;
	createdAt: string;
};

export default async function VideoGridLayout({ lang }: LangProps) {
	// console.log("LANG", lang);
	if (!isValidLang(lang)) notFound();

	// const newsRes = await getFeatured(lang);
	// const news: NewsType[] = newsRes.data;
	// console.log("Featured", news);
	return (
		<section className="bg-gray-950 -mx-4 px-4 py-16 mb-16 text-white border-y border-white/5">
			<div className="container mx-auto">
				{/* Header Section */}
				<div className="flex items-center justify-between mb-10">
					<div className="flex items-center gap-3">
						<div className="relative flex h-3 w-3">
							<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
							<span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
						</div>
						<h2 className="text-2xl font-black uppercase tracking-widest bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
							On The Ground: Video
						</h2>
					</div>
					<button className="text-xs font-bold uppercase tracking-tighter text-gray-400 hover:text-white transition-colors border-b border-gray-800 pb-1">
						View All Videos
					</button>
				</div>

				{/* Video Grid: 2 rows, 5 columns on desktop */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 gap-y-12">
					{/* Repeat this VideoCard component 10 times. I've simplified the structure for you below.
					 */}
					{[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
						<div key={item} className="group cursor-pointer">
							{/* Thumbnail Container */}
							<div className="relative aspect-video overflow-hidden rounded-sm bg-gray-900">
								<img
									src={`https://images.unsplash.com/photo-${
										1495020689067 + item
									}?w=500&q=80`}
									alt="Video thumbnail"
									className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
								/>

								{/* Dark Overlay Gradient */}
								<div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-60" />

								{/* Play Button Overlay (SVG FIX) */}
								<div className="absolute inset-0 flex items-center justify-center">
									<div className="w-12 h-12 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/30 scale-90 group-hover:scale-110 group-hover:bg-red-600 group-hover:border-red-600 transition-all duration-300 shadow-2xl">
										{/* SVG Play Icon */}
										<svg
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 0 24 24"
											fill="currentColor"
											className="w-5 h-5 ml-1 text-white"
										>
											<path
												fillRule="evenodd"
												d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
												clipRule="evenodd"
											/>
										</svg>
									</div>
								</div>

								{/* Duration Tag */}
								<div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/90 text-[10px] font-mono tracking-tighter rounded border border-white/10">
									08:42
								</div>
							</div>

							{/* Metadata */}
							<div className="mt-3">
								<h3 className="text-sm font-bold leading-snug line-clamp-2 group-hover:text-red-500 transition-colors">
									The last glaciers of the Andes are vanishing at record speeds
								</h3>
								<p className="mt-1 text-[11px] text-gray-500 uppercase tracking-wider font-medium">
									Documentary • 2 days ago
								</p>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
