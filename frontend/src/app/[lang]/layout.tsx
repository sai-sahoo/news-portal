import { isValidLang } from "@/lib/i18n";
import { notFound } from "next/navigation";
import Header from "@/components/layout/Header";
import Breaking from "@/components/home/BreakingBar";
import Footer from "@/components/layout/Footer";

export default async function LangLayout({
	children,
	params,
}: {
	children: React.ReactNode;
	params: Promise<{ lang: string }>;
}) {
	const { lang } = await params;

	if (!isValidLang(lang)) notFound();

	return (
		<>
			<Breaking lang={lang} />
			<Header lang={lang} />
			{children}
			<Footer lang={lang} />
		</>
	); // ✅ ONLY children
}
