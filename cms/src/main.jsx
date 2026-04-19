import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import StoreProvider from "./context/StoreProvider.jsx";
import { Toaster } from "react-hot-toast";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
	<QueryClientProvider client={queryClient}>
		<StoreProvider>
			<App />
			<Toaster />
		</StoreProvider>
	</QueryClientProvider>
);
