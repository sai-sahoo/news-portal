import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import storeContext from "../../context/storeContext";

const ProtectDashboard = () => {
	const { store } = useContext(storeContext);

	if (!store?.token) {
		return <Navigate to="/login" replace />;
	}

	return <Outlet />;
};

export default ProtectDashboard;