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

export default async function TwoColLayout({ lang, categorySlug }: PageProps) {
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
			<h2 className="text-2xl font-black uppercase tracking-tighter mb-8 text-center underline decoration-red-600 decoration-4 underline-offset-8">
				{categorySlug}
			</h2>
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
				{news.map((item) => {
					return (
						<div
							className="group relative overflow-hidden rounded-sm shadow-lg"
							key={item?._id}
						>
							<Link href={`/${lang}/${categorySlug}/${item?.slug}`}>
								<img
									src={item?.image}
									alt={item?.titleRegional || item?.title}
									className="w-full h-72 object-cover transition duration-500 group-hover:scale-110"
								/>
								<div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent p-8 flex flex-col justify-center max-w-md">
									<h3 className="text-white text-3xl font-bold leading-tight mb-4">
										{item?.titleRegional || item?.title}
									</h3>
								</div>
							</Link>
						</div>
					);
				})}
			</div>
		</section>
	);
}
