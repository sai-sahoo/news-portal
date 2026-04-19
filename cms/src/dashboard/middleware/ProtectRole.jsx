import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import storeContext from "../../context/storeContext";

const ProtectRole = ({ role }) => {
	const { store } = useContext(storeContext);

	if (store?.userInfo?.role !== role) {
		return <Navigate to="/dashboard/unable-access" replace />;
	}

	return <Outlet />;
};

export default ProtectRole;