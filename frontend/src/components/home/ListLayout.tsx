import { isValidLang, Lang } from "@/lib/i18n";
import Link from "next/link";
import { notFound } from "next/navigation";

type PageProps = {
	lang: Lang;
	categorySlug: string;
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

export default async function ListLayout({ lang, categorySlug }: PageProps) {
	// console.log("=======", lang, categorySlug);
	if (!isValidLang(lang)) notFound();

	const newsRes = await fetch(
		`http://localhost:5000/api/public/news/category/${categorySlug}?lang=${lang}`,
		{ cache: "no-store" }
	);
	const result = await newsRes.json();
	const news: NewsType[] = result.data;
	// console.log("CategoryWise News", news);
	return (
		<section className="mb-16">
			<div className="flex items-baseline justify-between border-b-2 border-black mb-6">
				<h2 className="text-2xl font-black uppercase tracking-tighter">
					{categorySlug}
				</h2>
				<a
					href="#"
					className="text-xs font-bold text-blue-800 hover:underline italic"
				>
					View All
				</a>
			</div>
			<div className="grid grid-cols-1 md:grid-cols-3 gap-10">
				<div className="md:col-span-2 border-r border-gray-100 pr-0 md:pr-10">
					<Link href={`/${lang}/${categorySlug}/${news[0]?.slug}`}>
						<article className="flex flex-col md:flex-row gap-6 group">
							<div className="md:w-1/2">
								<img
									src={news[0]?.image}
									alt={news[0]?.titleRegional || news[0]?.title}
									className="w-full h-64 object-cover"
								/>
							</div>
							<div className="md:w-1/2">
								<h3 className="text-2xl font-serif font-bold group-hover:text-blue-900 leading-tight">
									{news[0]?.titleRegional || news[0]?.title}
								</h3>
								<p className="text-gray-600 text-sm mt-3">
									{news[0]?.metaDescription}
								</p>
								<p className="text-xs text-gray-400 mt-4 font-bold uppercase">
									{news[0]?.writerName} •{" "}
									{new Date(news[0]?.createdAt).toLocaleDateString()}
								</p>
							</div>
						</article>
					</Link>
				</div>
				<div className="space-y-6">
					{news.slice(1).map((item) => {
						return (
							<div key={item._id}>
								<Link href={`/${lang}/${categorySlug}/${item?.slug}`}>
									<div>
										<h4 className="font-bold border-l-2 border-blue-600 pl-3 hover:text-blue-700 cursor-pointer italic">
											{item?.titleRegional || item?.title}
										</h4>
									</div>
								</Link>
								<hr />
							</div>
						);
					})}
				</div>
			</div>
		</section>
	);
}
