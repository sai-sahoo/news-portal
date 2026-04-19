import { isValidLang } from "@/lib/i18n";
import { notFound } from "next/navigation";

export default async function Privacy({
	params,
}: {
	params: Promise<{ lang: string }>;
}) {
	const { lang } = await params;

	if (!isValidLang(lang)) notFound();

	return (
		<main className="container mx-auto px-4 py-16">
			<div className="max-w-5xl mx-auto">
				<div className="border-b-4 border-black pb-8 mb-12">
					<span className="text-red-600 font-black text-xs uppercase tracking-[0.3em]">
						Compliance & Transparency
					</span>
					<h1 className="text-5xl md:text-6xl font-serif font-black tracking-tighter mt-2">
						Privacy Policy
					</h1>
					<p className="text-gray-400 font-bold mt-4 uppercase text-xs">
						Last Updated: March 20, 2026
					</p>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
					<aside className="lg:col-span-3">
						<div className="sticky top-24">
							<h4 className="font-black text-[10px] uppercase tracking-widest text-gray-400 mb-6">
								On this page
							</h4>
							<ul className="space-y-4 text-sm font-bold border-l border-gray-100 pl-4">
								<li>
									<a
										href="#introduction"
										className="hover:text-red-600 transition block"
									>
										1. Introduction
									</a>
								</li>
								<li>
									<a
										href="#data-collection"
										className="hover:text-red-600 transition block"
									>
										2. Data We Collect
									</a>
								</li>
								<li>
									<a
										href="#usage"
										className="hover:text-red-600 transition block"
									>
										3. How We Use Data
									</a>
								</li>
								<li>
									<a
										href="#cookies"
										className="hover:text-red-600 transition block"
									>
										4. Cookies & Tracking
									</a>
								</li>
								<li>
									<a
										href="#rights"
										className="hover:text-red-600 transition block"
									>
										5. Your Rights (GDPR/CCPA)
									</a>
								</li>
							</ul>

							<div className="mt-12 p-4 bg-gray-50 rounded-sm">
								<p className="text-[10px] leading-relaxed text-gray-500 uppercase font-bold">
									Questions?
								</p>
								<a
									href="mailto:legal@globalinsight.com"
									className="text-xs text-red-600 font-black hover:underline"
								>
									legal@globalinsight.com
								</a>
							</div>
						</div>
					</aside>

					<div className="lg:col-span-9 legal-body">
						<section id="introduction">
							<h2>1. Introduction</h2>
							<p>
								Welcome to Global Insight. We value your privacy and are
								committed to protecting your personal data. This Privacy Policy
								outlines how we collect, use, and safeguard your information
								when you visit our website, subscribe to our newsletters, or use
								our mobile applications.
							</p>
							<p>
								By using our services, you agree to the practices described in
								this policy. If you do not agree with these terms, please
								discontinue use of our platform immediately.
							</p>
						</section>

						<section id="data-collection">
							<h2>2. Data We Collect</h2>
							<p>
								We collect information that you provide directly to us, such as
								when you create an account, sign up for a newsletter, or
								participate in a survey. This may include:
							</p>
							<ul className="list-disc pl-6 mb-6 space-y-2 text-gray-600">
								<li>Name and contact information</li>
								<li>Payment details for subscriptions</li>
								<li>Preferences and interests</li>
								<li>Comments or contributions to our forums</li>
							</ul>
						</section>

						<section id="usage">
							<h2>3. How We Use Data</h2>
							<p>
								Your data allows us to provide a personalized news experience.
								Specifically, we use it to:
							</p>
							<ul className="list-disc pl-6 mb-6 space-y-2 text-gray-600">
								<li>Deliver the newsletters you requested</li>
								<li>Process payments and manage your subscription</li>
								<li>Analyze site traffic to improve our editorial content</li>
								<li>Detect and prevent fraudulent activity</li>
							</ul>
						</section>

						<section id="cookies">
							<h2>4. Cookies & Tracking</h2>
							<p>
								We use cookies and similar tracking technologies to track
								activity on our Service and hold certain information. Cookies
								are files with small amount of data which may include an
								anonymous unique identifier.
							</p>
							<div className="bg-gray-50 border-l-4 border-black p-6 my-8 italic">
								"You can instruct your browser to refuse all cookies or to
								indicate when a cookie is being sent. However, if you do not
								accept cookies, you may not be able to use some portions of our
								Service."
							</div>
						</section>

						<section id="rights">
							<h2>5. Your Rights (GDPR/CCPA)</h2>
							<p>
								Depending on your location, you may have rights under the
								General Data Protection Regulation (GDPR) or the California
								Consumer Privacy Act (CCPA). These include the right to access,
								delete, or port your data.
							</p>
							<p>
								To exercise these rights, please contact our Data Protection
								Officer at the email listed in the sidebar.
							</p>
						</section>
					</div>
				</div>
			</div>
		</main>
	);
}
