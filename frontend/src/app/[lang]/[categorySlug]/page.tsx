import { notFound } from "next/navigation";
import { isValidLang, Lang } from "@/lib/i18n";
import { getCategoryBySlug } from "@/lib/api/category";
import Link from "next/link";

type PageProps = {
	params: Promise<{
		lang: Lang;
		categorySlug: string;
	}>;
};
type NewsType = {
	_id: string;
	title: string;
	titleRegional: string;
	metaDescription: string;
	slug: string;
	image: string;
	writerName?: string;
	createdAt: string;
};

export default async function CategoryPage({ params }: PageProps) {
	const { lang, categorySlug } = await params;

	// ✅ Validate language
	if (!isValidLang(lang)) notFound();

	// ✅ Fetch category by slug
	const res = await getCategoryBySlug(categorySlug, lang);
	// console.log(res);

	if (!res?.data) notFound();

	const category = res.data;

	const newsRes = await fetch(
		`http://localhost:5000/api/public/news/category/${categorySlug}?lang=${lang}`,
		{ cache: "no-store" }
	);
	const result = await newsRes.json();
	const news: NewsType[] = result.data;

	return (
		<main className="container mx-auto px-4 py-12">
			<h1 className="text-3xl font-bold mb-4">
				{category.nameRegional || category.name}
			</h1>
			<p className="text-gray-500">Slug: {categorySlug}</p>
			<div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
				<div className="lg:col-span-8 space-y-12">
					<Link href={`/${lang}/${categorySlug}/${news[0]?.slug}`}>
						<div className="group cursor-pointer">
							<div className="relative overflow-hidden mb-6">
								<img
									src={news[0]?.image}
									className="w-full h-96 object-cover group-hover:scale-105 transition duration-700"
								/>
								<span className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 text-[10px] font-black uppercase">
									{category.nameRegional || category.name}
								</span>
							</div>
							<h2 className="text-3xl font-black mb-4 leading-tight group-hover:text-red-600 transition">
								{news[0]?.titleRegional || news[0]?.title}
							</h2>
							<p className="text-gray-600 leading-relaxed mb-4">
								{news[0]?.metaDescription || ""}
							</p>
							<div className="flex items-center gap-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
								<span>By {news[0]?.writerName}</span>
								<span>•</span>
								<span>{new Date(news[0]?.createdAt).toLocaleDateString()}</span>
							</div>
						</div>
					</Link>
					<hr className="border-gray-100" />

					<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
						{news.slice(1).map((item) => (
							<article className="group cursor-pointer" key={item?._id}>
								<Link href={`/${lang}/${categorySlug}/${item.slug}`}>
									<img
										src={item.image}
										alt={item?.titleRegional || item?.title}
										className="w-full h-48 object-cover mb-4 grayscale group-hover:grayscale-0 transition duration-500"
									/>
									<h3 className="font-bold text-lg leading-tight group-hover:text-red-600">
										{item?.titleRegional || item?.title}
									</h3>
									<p className="text-gray-500 text-sm mt-2 line-clamp-2">
										{item?.metaDescription || ""}
									</p>
									<p className="text-sm text-gray-500 mt-2">
										{new Date(item.createdAt).toLocaleDateString()}
									</p>
								</Link>
							</article>
						))}
					</div>

					<div className="pt-10 flex justify-center">
						<button className="px-12 py-4 border-2 border-black font-black uppercase text-xs tracking-widest hover:bg-black hover:text-white transition shadow-[4px_4px_0px_#000] active:translate-y-1 active:shadow-none">
							Load More Stories
						</button>
					</div>
				</div>

				<aside className="lg:col-span-4 space-y-12">
					<div className="bg-black text-white p-8">
						<h3 className="text-2xl font-black uppercase tracking-tighter mb-4 italic">
							The Tech Pulse
						</h3>
						<p className="text-gray-400 text-sm mb-6">
							Weekly insights into the code and silicon shaping our world.
						</p>
						<input
							type="email"
							placeholder="Email address"
							className="w-full bg-gray-800 border-none px-4 py-3 text-sm mb-4 focus:ring-1 focus:ring-red-600"
						/>
						<button className="w-full bg-red-600 py-3 text-xs font-black uppercase tracking-widest hover:bg-red-700 transition">
							Subscribe
						</button>
					</div>

					<div>
						<h3 className="font-black text-sm uppercase border-b-2 border-black mb-6 pb-2">
							Most Read
						</h3>
						<div className="space-y-6">
							<div className="flex gap-4 group cursor-pointer">
								<span className="text-3xl font-serif text-gray-200 font-black">
									01
								</span>
								<div>
									<h4 className="font-bold text-sm leading-tight group-hover:underline uppercase">
										The end of the Smartphone era is closer than you think.
									</h4>
									<span className="text-[10px] text-gray-400">1.2M Views</span>
								</div>
							</div>
							<div className="flex gap-4 group cursor-pointer border-t border-gray-100 pt-6">
								<span className="text-3xl font-serif text-gray-200 font-black">
									02
								</span>
								<div>
									<h4 className="font-bold text-sm leading-tight group-hover:underline uppercase">
										Why everyone is suddenly moving to Linux in 2026.
									</h4>
									<span className="text-[10px] text-gray-400">850K Views</span>
								</div>
							</div>
						</div>
					</div>

					<div className="bg-gray-100 border-2 border-dashed border-gray-300 h-96 flex flex-col items-center justify-center p-4">
						<span className="text-[10px] text-gray-400 font-bold mb-4 uppercase">
							Sponsor Message
						</span>
						<div className="text-center">
							<p className="font-bold text-gray-600 mb-2">
								Cloud Infrastructure for the 1%
							</p>
							<p className="text-xs text-gray-500">
								Enterprise grade. Human support.
							</p>
						</div>
					</div>
				</aside>
			</div>
		</main>
	);
}
