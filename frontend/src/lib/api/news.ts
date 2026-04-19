export async function getFeatured(lang: string) {
	const res = await fetch(
		`http://localhost:5000/api/public/news/featured?lang=${lang}`,
		{
			cache: "no-store", // for fresh news data
		}
	);
	if (!res.ok) {
		throw new Error("Failed to fetch featured news");
	}
	return res.json();
}
