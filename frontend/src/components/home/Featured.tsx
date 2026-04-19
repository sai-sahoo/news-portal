import { getFeatured } from "@/lib/api/news";
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

export default async function Featured({ lang }: LangProps) {
	// console.log("LANG", lang);
	if (!isValidLang(lang)) notFound();

	const newsRes = await getFeatured(lang);
	const news: NewsType[] = newsRes.data;
	// console.log("Featured", news);
	return (
		<section className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
			<div className="lg:col-span-6 border-r border-gray-100 pr-0 lg:pr-8">
				<div className="group cursor-pointer">
					<Link href={`/${lang}/${news[0]?.categorySlug}/${news[0]?.slug}`}>
						{/* Image Container with Placeholder Background */}
						<div className="relative w-full aspect-video overflow-hidden mb-4 bg-linear-to-br from-slate-100 to-slate-200">
							<img
								src={news[0]?.image}
								alt={news[0]?.titleRegional || news[0]?.title}
								className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
							/>

							{/* Subtle overlay that makes the red hover pop more */}
							<div className="absolute inset-0 bg-black/5 group-hover:bg-red-900/10 transition-colors duration-300" />
						</div>

						<h2 className="text-4xl font-serif font-black leading-tight group-hover:text-red-700 transition-colors duration-300">
							{news[0]?.titleRegional || news[0]?.title}
						</h2>

						<p className="text-gray-600 mt-4 text-lg leading-relaxed line-clamp-3">
							{news[0]?.metaDescription
								? news[0].metaDescription.substring(0, 150) + "..."
								: ""}
						</p>
					</Link>
				</div>
			</div>

			<div className="lg:col-span-3 border-r border-gray-100 pr-0 lg:pr-8 space-y-8">
				{news.slice(1).map((item) => {
					return (
						<div key={item?._id}>
							<div className="group">
								<Link href={`/${lang}/${item.categorySlug}/${item.slug}`}>
									<span className="text-red-600 font-black text-[10px] uppercase tracking-tighter">
										{item?.categoryNameRegional || item?.categoryName}
									</span>
									<h3 className="font-bold text-lg leading-tight mt-1 group-hover:underline">
										{item?.titleRegional || item?.title}
									</h3>
								</Link>
							</div>
							<hr />
						</div>
					);
				})}
			</div>

			<div className="lg:col-span-3">
				<div className="bg-gray-100 p-4 mb-8 text-center border border-gray-200">
					<p className="text-[10px] text-gray-400 mb-2 uppercase">Sponsored</p>
					<div className="h-60 bg-gray-300 flex items-center justify-center font-bold text-gray-500">
						300 x 250 AD
					</div>
				</div>
			</div>
		</section>
	);
}
