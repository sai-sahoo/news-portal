import { getCategories } from "@/lib/api/category";
import { Lang } from "@/lib/i18n";
import CategoryClient from "./CategoryClient";

type Props = {
	lang: Lang;
};

type Category = {
	_id: string;
	name: string;
	nameRegional: string;
	slug: string;
	parentCategory: string | null;
	showInMenu: boolean;
	order: number;
};

type CategoryNode = Category & {
	children: CategoryNode[];
};

function buildCategoryTree(categories: Category[]): CategoryNode[] {
	const map = new Map<string, CategoryNode>();
	const roots: CategoryNode[] = [];

	categories
		.filter((c) => c.showInMenu)
		.forEach((cat) => {
			map.set(cat._id, { ...cat, children: [] });
		});

	map.forEach((cat) => {
		if (cat.parentCategory && map.has(cat.parentCategory)) {
			map.get(cat.parentCategory)!.children.push(cat);
		} else {
			roots.push(cat);
		}
	});

	function sortTree(nodes: CategoryNode[]) {
		nodes.sort((a, b) => a.order - b.order);
		nodes.forEach((n) => sortTree(n.children));
	}

	sortTree(roots);

	return roots;
}

export default async function CategoryServer({ lang }: Props) {
	const res = await getCategories(lang);
	const tree = buildCategoryTree(res.data);

	return <CategoryClient tree={tree} lang={lang} />;
}
