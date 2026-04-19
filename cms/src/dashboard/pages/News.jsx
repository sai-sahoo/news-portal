import { Link } from "react-router-dom";
import NewsContent from "../components/NewsContent";

const News = () => {
	return (
		<div className="space-y-6">

			{/* Page Header */}
			<div className="flex justify-between items-center border-b border-slate-200 pb-4">
				<h2 className="text-xl font-semibold text-slate-800">
					News Articles
				</h2>

				<Link
					to="/dashboard/news/create"
					className="px-4 py-2 text-sm bg-slate-900 text-white hover:bg-slate-700 transition"
				>
					+ Create Article
				</Link>
			</div>

			{/* Table Section */}
			<NewsContent />

		</div>
	);
};

export default News;