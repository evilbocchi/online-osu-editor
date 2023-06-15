/// <reference types="vite/client" />

import express, { Request, Response } from "express";
import httpDevServer from "vavite/http-dev-server";
import viteDevServer from "vavite/vite-dev-server";
import { ComponentType } from "react";
import { renderToString } from "react-dom/server";
import { createRequire } from 'node:module';
import App from "@/App";

const app = express();
const require = createRequire(import.meta.url);

if (import.meta.env.PROD) {
	// Serve client assets in production
	app.use(express.static("dist/client"));
}

// Page routes
app.get("", (req, res) => render(req, res, () => import("./App")));


var fs = require('fs');
var path = require('path');
var walk = function (dir, done) {
	var results = [];
	fs.readdir(dir, function (err, list) {
		if (err) return done(err);
		var pending = list.length;
		if (!pending) return done(null, results);
		list.forEach(function (file) {
			file = path.resolve(dir, file);
			fs.stat(file, function (err, stat) {
				if (stat && stat.isDirectory()) {
					walk(file, function (err, res) {
						results = results.concat(res);
						if (!--pending) done(null, results);
					});
				} else {
					results.push(file);
					if (!--pending) done(null, results);
				}
			});
		});
	});
};

walk("public/defaultuserfiles", (err, results: [string]) => {
	if (err) {
		throw err;
	}
	for (var i = 0;  i < results.length; i++) {
		results[i] = path.normalize(results[i].substring(results[i].indexOf("defaultuserfiles")));
	}

	app.get("/defaultfilesindex", (_req, res) => {
		res.send(results);
	});
})

type PageImporter = () => Promise<{ default: ComponentType }>;

async function render(req: Request, res: Response, importer: PageImporter) {
	const Page = (await importer()).default;

	let clientEntryPath: string;
	if (viteDevServer) {
		// In development, we can simply refer to the source file name
		clientEntryPath = "/src/entry-client.tsx";
	} else {
		// In production we'll figure out the path to the client entry file using the manifest
		// @ts-expect-error: This only exists after the client build is complete
		const manifest = (await import("./dist/client/manifest.json")).default;
		clientEntryPath = manifest["entry-client.tsx"].file;

		// In a real application we would also use the manifest to generate
		// preload links for assets needed for the rendered page
	}

	let html = `<!DOCTYPE html><html lang="en">
		<head>
			<meta charset="UTF-8">
			<title>online editor</title>
		</head>
		<body>
			<div id="root">${renderToString(
		//@ts-ignore
		<App>
			<Page />
		</App>,
	)}</div>
			<script type="module" src="${clientEntryPath}"></script>
		</body>
	</html>`;

	if (viteDevServer) {
		// This will inject the Vite client and React fast refresh in development
		html = await viteDevServer.transformIndexHtml(req.url, html);
	}

	res.send(html);
}

if (viteDevServer) {
	httpDevServer!.on("request", app);
} else {
	console.log("Starting production server");
	app.listen(3000);
}