import Link from "next/link";

const languages = [
	{ code: "en", label: "English" },
	{ code: "hi", label: "हिन्दी" },
	{ code: "od", label: "ଓଡ଼ିଆ" },
];

export default function LanguageSwitcher({ lang }: { lang: string }) {
	return (
		<div className="flex gap-2">
			{languages.map((lng) => (
				<Link
					key={lng.code}
					href={`/${lng.code}`}
					className={`px-3 py-1 rounded ${
						lng.code === lang
							? "bg-red-600 text-white font-black rounded shadow-lg"
							: "bg-gray-200 text-black"
					}`}
				>
					{lng.label}
				</Link>
			))}
		</div>
	);
}
