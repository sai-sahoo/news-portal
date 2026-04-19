import { Lang } from "@/lib/i18n";
type Props = {
  lang: Lang;
};
export default function Breaking({ lang }: Props) {
	return (
		<div className="bg-black text-white py-2 overflow-hidden whitespace-nowrap">
			<div className="container mx-auto px-4 flex items-center">
				<span className="bg-red-600 px-2 py-0.5 text-xs font-bold mr-4 animate-pulse uppercase">
					Breaking
				</span>
				<p className="text-sm font-medium">
					Global Markets reach record highs amid new trade agreement • NASA
					confirms discovery of water on distant moon • Election results delayed
					in key provinces.
				</p>
			</div>
		</div>
	);
}
