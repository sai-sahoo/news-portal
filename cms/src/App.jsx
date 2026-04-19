import {
	createBrowserRouter,
	BrowserRouter,
	Routes,
	Route,
	Navigate,
	RouterProvider,
} from "react-router-dom";
import Login from "./dashboard/pages/Login";
import MainLayout from "./dashboard/layout/MainLayout";
import Adminindex from "./dashboard/pages/Adminindex";
import ProtectDashboard from "./dashboard/middleware/ProtectDashboard";
import ProtectRole from "./dashboard/middleware/ProtectRole";
import Unable from "./dashboard/pages/Unable";
import Profile from "./dashboard/pages/Profile";
import News from "./dashboard/pages/News";
import AddWriter from "./dashboard/pages/AddWriter";
import Writers from "./dashboard/pages/Writers";
import Writerindex from "./dashboard/pages/Writerindex";
import CreateNews from "./dashboard/pages/CreateNews";
import { useContext } from "react";
import storeContext from "./context/storeContext";
import EditNews from "./dashboard/pages/EditNews";
import CategoryList from "./dashboard/pages/Category/CategoryList";
import CategoryForm from "./dashboard/pages/Category/CategoryForm";
import AuthLoading from "./dashboard/components/AuthLoading";
import AddEditPoll from "./dashboard/pages/Poll/AddEditPoll";
import Polls from "./dashboard/pages/Poll/Polls";

import AddEditPlacement from "./dashboard/pages/Ads/Placements/AddEditPlacement";
import Placements from "./dashboard/pages/Ads/Placements/Placements";
import AddEditAdvertiser from "./dashboard/pages/Ads/Advertisers/AddEditAdvertiser";
import Advertisers from "./dashboard/pages/Ads/Advertisers/Advertisers";
import AddEditCampaign from "./dashboard/pages/Ads/Campaigns/AddEditCampaign";
import Campaigns from "./dashboard/pages/Ads/Campaigns/Campaigns";
import AddEditCreative from "./dashboard/pages/Ads/Creatives/AddEditCreative";
import Creatives from "./dashboard/pages/Ads/Creatives/Creatives";

function App() {
	const { authLoading, store } = useContext(storeContext);

	if (authLoading) {
		return <AuthLoading />;
	}

	return (
		<BrowserRouter>
			<Routes>
				<Route path="/login" element={<Login />} />

				<Route path="/dashboard" element={<ProtectDashboard />}>
					<Route element={<MainLayout />}>
						<Route
							index
							element={
								store?.userInfo?.role === "admin" ? (
									<Navigate to="/dashboard/admin" replace />
								) : store?.userInfo?.role === "writer" ? (
									<Navigate to="/dashboard/writer" replace />
								) : (
									<Navigate to="/login" replace />
								)
							}
						/>

						<Route path="unable-access" element={<Unable />} />
						<Route path="profile" element={<Profile />} />
						<Route path="news" element={<News />} />
						<Route path="news/create" element={<CreateNews />} />
						<Route path="news/edit/:news_id" element={<EditNews />} />

						<Route element={<ProtectRole role="admin" />}>
							<Route path="admin" element={<Adminindex />} />
							<Route path="writer/add" element={<AddWriter />} />
							<Route path="writer/edit/:id" element={<AddWriter />} />
							<Route path="writers" element={<Writers />} />
							<Route path="categories" element={<CategoryList />} />
							<Route path="categories/add" element={<CategoryForm />} />
							<Route path="categories/edit/:id" element={<CategoryForm />} />
							<Route path="poll/add" element={<AddEditPoll />} />
							<Route path="poll/edit/:id" element={<AddEditPoll />} />
							<Route path="polls" element={<Polls />} />

							<Route path="ad/placement/add" element={<AddEditPlacement />} />
							<Route path="ad/placement/edit/:id" element={<AddEditPlacement />} />
							<Route path="ads/placements" element={<Placements />} />

							<Route path="ad/advertiser/add" element={<AddEditAdvertiser />} />
							<Route path="ad/advertiser/edit/:id" element={<AddEditAdvertiser />} />
							<Route path="ads/advertisers" element={<Advertisers />} />

							<Route path="ad/campaign/add" element={<AddEditCampaign />} />
							<Route path="ad/campaign/edit/:id" element={<AddEditCampaign />} />
							<Route path="ads/campaigns" element={<Campaigns />} />

							<Route path="ad/creative/add" element={<AddEditCreative />} />
							<Route path="ad/creative/edit/:id" element={<AddEditCreative />} />
							<Route path="ads/creatives" element={<Creatives />} />
						</Route>

						<Route element={<ProtectRole role="writer" />}>
							<Route path="writer" element={<Writerindex />} />
						</Route>
					</Route>
				</Route>
			</Routes>
		</BrowserRouter>
	);
}
/* const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/dashboard",
    element: <ProtectDashboard />,
    children: [
      {
        element: <MainLayout />,
        children: [
          {
            index: true,
            element: <Navigate to="admin" />,
          },
          {
            path: "admin",
            element: <Adminindex />,
          },
        ],
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
} */

export default App;
