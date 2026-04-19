import Featured from "@/components/home/Featured";
import FourColLayout from "@/components/home/FourColLayout";
import ListLayout from "@/components/home/ListLayout";
import ThreeColLayout from "@/components/home/ThreeColLayout";
import TwoColLayout from "@/components/home/TwoColLayout";
import VideoGridLayout from "@/components/home/VideoGridLayout";
import { isValidLang } from "@/lib/i18n";
import { notFound } from "next/navigation";
import { getHomeCategories } from "@/lib/api/category";

const LAYOUT_COMPONENTS = [
	ListLayout,
	TwoColLayout,
	ThreeColLayout,
	FourColLayout,
];
interface Category {
	_id: string;
	slug: string;
	name: string;
	contentLang: string;
	[key: string]: any;
}

export default async function Page({
	params,
}: {
	params: Promise<{ lang: string }>;
}) {
	const { lang } = await params;
	if (!isValidLang(lang)) notFound();

	const res = await getHomeCategories(lang);
	const categoriesData = res.data;
	const homeCategories = categoriesData.map((category: Category) => ({
		id: category._id,
		slug: category.slug,
	}));
	// console.log("HomeCategories", homeCategories);

	return (
		<main className="container mx-auto px-4 py-12">
			<h1>Language: {lang}</h1>
			<p>Welcome to News Portal</p>
			<Featured lang={lang} />
			<VideoGridLayout lang={lang} />
			{homeCategories.map((cat: any, index: number) => {
                // Select the component reference using modulo
                const SelectedLayout = LAYOUT_COMPONENTS[index % LAYOUT_COMPONENTS.length];
                
                // Render it as a proper JSX tag
                // This ensures refs, context, and hooks work perfectly
                return (
                    <SelectedLayout 
                        key={cat.id} 
                        lang={lang} 
                        categorySlug={cat.slug} 
                    />
                );
            })}
		</main>
	);
}
