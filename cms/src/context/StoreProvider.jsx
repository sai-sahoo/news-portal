import { useReducer, useEffect, useState } from "react";
import storeReducer from "./storeReducer";
import storeContext from "./storeContext";

const StoreProvider = ({ children }) => {
	const [authLoading, setAuthLoading] = useState(true);

	const [store, dispatch] = useReducer(storeReducer, {
		userInfo: null,
		token: "",
	});

	useEffect(() => {
		const token = localStorage.getItem("newsToken");

		if (token) {
			dispatch({
				type: "login_success",
				payload: { token },
			});
		}

		setAuthLoading(false);
	}, []);

	return (
		<storeContext.Provider value={{ store, dispatch, authLoading }}>
			{children}
		</storeContext.Provider>
	);
};

export default StoreProvider;
