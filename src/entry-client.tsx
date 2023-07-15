import { hydrateRoot } from 'react-dom/client';
import React from "react";
import App from "@/App";

async function render() {
	hydrateRoot(document.getElementById('root'),
		<React.StrictMode>
			<App />
		</React.StrictMode>
	);
}
render();