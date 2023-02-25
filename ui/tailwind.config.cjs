const {
	iconsPlugin,
	getIconCollections,
} = require("@egoist/tailwindcss-icons");

/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
	theme: {
		extend: {},
	},
	plugins: [
		iconsPlugin({
			collections: getIconCollections(["mdi", "ion"]),
		}),
	],
};
