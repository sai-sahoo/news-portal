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

export default async function ThreeColLayout({
	lang,
	categorySlug,
}: PageProps) {
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
			<div className="flex items-center gap-4 mb-8">
				<h2 className="text-2xl font-black uppercase tracking-tighter">
					{categorySlug}
				</h2>
				<div className="h-0.5 grow bg-gray-100"></div>
			</div>
			<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
				<div className="md:col-span-2 md:row-span-2 relative group overflow-hidden bg-black">
					<Link href={`/${lang}/${categorySlug}/${news[0]?.slug}`}>
						<img
							src={news[0]?.image}
							alt={news[0]?.titleRegional || news[0]?.title}
							className="w-full h-full object-cover opacity-70 group-hover:scale-105 transition duration-700"
						/>
						<div className="absolute bottom-0 left-0 p-8 text-white">
							<h3 className="text-3xl font-serif font-bold leading-tight">
								{news[0]?.titleRegional || news[0]?.title}
							</h3>
							<p className="mt-4 text-gray-300 text-sm italic">
								{news[0]?.metaDescription}
							</p>
						</div>
					</Link>
				</div>

				{news.slice(1).map((item) => {
					return (
						<div
							className="bg-white border-b border-gray-100 pb-4"
							key={item?._id}
						>
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
