import decode_token from "../utils";

const storeReducer = (state, action) => {
	const { type, payload } = action;

	switch (type) {
		case "login_success":
			return {
				...state,
				token: payload.token,
				userInfo: decode_token(payload.token),
			};

		case "logout":
			return {
				...state,
				token: "",
				userInfo: null,
			};

		default:
			return state;
	}
};

export default storeReducer;
