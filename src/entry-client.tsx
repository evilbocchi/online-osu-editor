import { hydrateRoot } from "react-dom/client";
import App from "@/App";

async function render() {
	const root = document.getElementById("root");
	hydrateRoot(
		root,
		<App />,
	);
}
render();