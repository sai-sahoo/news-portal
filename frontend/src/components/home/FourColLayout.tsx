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

export default async function FourColLayout({ lang, categorySlug }: PageProps) {
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
					className="text-xs font-bold text-red-600 hover:underline italic"
				>
					See All Tech &rarr;
				</a>
			</div>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				{news.map((item) => {
					return (
						<div className="space-y-3 group" key={item?._id}>
							<Link href={`/${lang}/${categorySlug}/${item?.slug}`}>
								<div className="relative w-full h-40 overflow-hidden bg-linear-to-br from-slate-200 to-slate-300">
									<img
										src={item?.image}
										alt={item?.titleRegional || item?.title}
										className="w-full absolute inset-0 bg-linear-to-br from-black/70 to-transparent h-40 object-cover transition duration-500 group-hover:scale-110"
									/>
								</div>
								<h4 className="font-bold text-sm leading-tight hover:text-red-600 cursor-pointer">
									{item?.titleRegional || item?.title}
								</h4>
							</Link>
						</div>
					);
				})}
			</div>
		</section>
	);
}
