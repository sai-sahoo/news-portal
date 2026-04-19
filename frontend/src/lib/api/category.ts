export async function getCategories(lang: string) {
	const res = await fetch(
		`http://localhost:5000/api/public/categories?lang=${lang}`,
		{
			cache: "no-store", // for fresh news data
		}
	);

	if (!res.ok) {
		throw new Error("Failed to fetch categories");
	}

	return res.json();
}
export async function getHomeCategories(lang: string) {
	const res = await fetch(
		`http://localhost:5000/api/public/categories/homepage?lang=${lang}`,
		{
			cache: "no-store", // for fresh news data
		}
	);

	if (!res.ok) {
		throw new Error("Failed to fetch Home page categories");
	}

	return res.json();
}
export async function getCategoryBySlug(slug: string, lang: string) {
	/* const res = await fetch(
		`${process.env.NEXT_PUBLIC_API_URL}/categories/slug/${slug}?lang=${lang}`,
		{ cache: "no-store" }
	); */
	// console.log('slug', `http://localhost:5000/api/public/categories/slug/${slug}?lang=${lang}`);
	const res = await fetch(
		`http://localhost:5000/api/public/categories/slug/${slug}?lang=${lang}`,
		{ cache: "no-store" }
	);

	return res.json();
}
