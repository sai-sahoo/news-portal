import { isValidLang } from "@/lib/i18n";
import { notFound } from "next/navigation";

export default async function Contact({
    params,
}: {
    params: Promise<{ lang: string }>;
}) {
    const { lang } = await params;

    if (!isValidLang(lang)) notFound();

    return (
        <main className="container mx-auto px-4 py-16">
        
        <div className="max-w-4xl mx-auto text-center mb-16">
            <h1 className="text-5xl md:text-7xl font-serif font-black tracking-tighter uppercase mb-6">Contact Us</h1>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
                Have a story we should cover? Need help with your subscription? Choose the best way to reach our team below.
            </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-6xl mx-auto">
            
            <div className="lg:col-span-7 bg-black text-white p-8 md:p-12 shadow-2xl relative overflow-hidden">
                <i className="fas fa-user-secret absolute -right-10 -bottom-10 text-[200px] opacity-10"></i>

                <div className="relative z-10">
                    <span className="bg-red-600 text-white px-3 py-1 text-[10px] font-black uppercase tracking-widest mb-6 inline-block">Highly Confidential</span>
                    <h2 className="text-3xl font-serif font-bold mb-4">Send us a Tip</h2>
                    <p className="text-gray-400 mb-8 leading-relaxed">
                        We take the protection of our sources seriously. If you have sensitive documents or information regarding corruption, corporate malpractice, or human rights, use our encrypted channels.
                    </p>

                    <div className="space-y-6 mb-10">
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-gray-800 flex items-center justify-center rounded-full flex-shrink-0 text-red-500"><i className="fas fa-lock"></i></div>
                            <div>
                                <h4 className="font-bold">Signal / WhatsApp</h4>
                                <p className="text-sm text-gray-400">+1 (555) 982-0041 (Encrypted Messaging Only)</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-gray-800 flex items-center justify-center rounded-full flex-shrink-0 text-red-500"><i className="fas fa-key"></i></div>
                            <div>
                                <h4 className="font-bold">PGP Public Key</h4>
                                <p className="text-xs font-mono text-gray-500 break-all">7A3B 92C1 E0F4 ... (Click to download key)</p>
                            </div>
                        </div>
                    </div>

                    <form className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input type="text" placeholder="Subject" className="w-full bg-gray-900 border border-gray-800 p-4 text-sm focus:border-red-600 outline-none transition" />
                            <select className="w-full bg-gray-900 border border-gray-800 p-4 text-sm focus:border-red-600 outline-none transition text-gray-400">
                                <option>Select Department</option>
                                <option>Investigative Desk</option>
                                <option>Politics</option>
                                <option>Tech/Security</option>
                            </select>
                        </div>
                        <textarea rows={5} placeholder="Your Message or Lead..." className="w-full bg-gray-900 border border-gray-800 p-4 text-sm focus:border-red-600 outline-none transition"></textarea>
                        <div className="flex items-center gap-4 py-2">
                            <input type="checkbox" id="anon" className="accent-red-600" />
                            <label htmlFor="anon" className="text-xs text-gray-400">I wish to remain anonymous</label>
                        </div>
                        <button className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-4 uppercase tracking-widest transition">Submit Secure Tip</button>
                    </form>
                </div>
            </div>

            <div className="lg:col-span-5 space-y-8">
                
                <div className="bg-white border border-gray-200 p-8 shadow-sm">
                    <h3 className="font-black text-xs uppercase tracking-widest text-gray-400 mb-4">Customer Support</h3>
                    <h4 className="text-xl font-bold mb-2">Subscription & Billing</h4>
                    <p className="text-sm text-gray-600 mb-4">Manage your account, cancel service, or report a delivery issue.</p>
                    <a href="mailto:support@globalinsight.com" className="text-red-600 font-bold hover:underline">support@globalinsight.com</a>
                </div>

                <div className="bg-white border border-gray-200 p-8 shadow-sm">
                    <h3 className="font-black text-xs uppercase tracking-widest text-gray-400 mb-4">Partnerships</h3>
                    <h4 className="text-xl font-bold mb-2">Advertise with Us</h4>
                    <p className="text-sm text-gray-600 mb-4">Reach over 5 million monthly readers across our digital platforms.</p>
                    <button className="text-xs font-black uppercase border-b-2 border-black pb-1 hover:text-red-600 hover:border-red-600 transition">Download Media Kit</button>
                </div>

                <div className="p-8">
                    <h3 className="font-black text-xs uppercase tracking-widest text-gray-400 mb-6">Our Newsrooms</h3>
                    <div className="space-y-6">
                        <div>
                            <p className="font-bold">New York City (HQ)</p>
                            <p className="text-sm text-gray-500 leading-relaxed">
                                250 West 55th Street<br/>
                                New York, NY 10019
                            </p>
                        </div>
                        <div>
                            <p className="font-bold">London</p>
                            <p className="text-sm text-gray-500 leading-relaxed">
                                1 Canada Square, Canary Wharf<br/>
                                London E14 5AB, UK
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </main>
    );
}
