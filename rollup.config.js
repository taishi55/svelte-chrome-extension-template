import { spawn } from "child_process";
import svelte from "rollup-plugin-svelte";
import commonjs from "@rollup/plugin-commonjs";
import terser from "@rollup/plugin-terser";
import resolve from "@rollup/plugin-node-resolve";
import livereload from "rollup-plugin-livereload";
import css from "rollup-plugin-css-only";
import sveltePreprocess from "svelte-preprocess";
import typescript from "rollup-plugin-typescript2";
import postcss from "rollup-plugin-postcss";
import fs from 'fs-extra';

const copyFilePlugin = (sourceDir, targetDir) => {
	return {
		name: 'copy-file',
		buildStart() {
			fs.copy(sourceDir, targetDir, { overwrite: true }, err => {
				if (err) return console.error(err);
				console.log(`${sourceDir} copied successfully!`);
			});
		}
	};
};

const production = !process.env.ROLLUP_WATCH;

function serve() {
	let server;

	function toExit() {
		if (server) server.kill(0);
	}

	return {
		writeBundle() {
			if (server) return;
			server = spawn("npm", ["run", "start", "--", "--dev"], {
				stdio: ["ignore", "inherit", "inherit"],
				shell: true,
			});

			process.on("SIGTERM", toExit);
			process.on("exit", toExit);
		},
	};
}

export default [
	{
		input: "src/background/background.ts",
		output: {
			sourcemap: false,
			format: "iife",
			name: "app",
			file: "public/build/background.js",
		},
		plugins: [
			typescript({ sourceMap: false }),
			resolve(),
			commonjs(),
			production && terser(),
		],
		watch: {
			clearScreen: false,
		},
	},
	{
		input: "src/content/content.ts",
		output: {
			sourcemap: false,
			format: "iife",
			name: "app",
			file: "public/build/content.js",
		},
		plugins: [
			typescript({ sourceMap: false }),
			resolve(),
			commonjs(),
			production && terser(),
		],
		watch: {
			clearScreen: false,
		},
	},
	{
		input: "src/content/content.css",
		output: {
			sourcemap: false,
			file: "public/build/content.css",
		},
		plugins: [
			postcss({
				extract: true,
				minimize: production,
			}),
		],
	},
	{
		input: "src/main.ts",
		output: {
			sourcemap: false,
			format: "iife",
			name: "app",
			file: "public/build/bundle.js",
		},
		plugins: [
			svelte({
				preprocess: sveltePreprocess({ sourceMap: false }),
				compilerOptions: {
					// enable run-time checks when not in production
					dev: !production,
				},
			}),
			postcss({
				extract: true,
				minimize: true,
				use: [
					[
						"sass",
						{
							includePaths: ["./src/theme", "./node_modules"],
						},
					],
				],
			}),
			// we'll extract any component CSS out into
			// a separate file - better for performance
			css({ output: "bundle.css" }),

			// If you have external dependencies installed from
			// npm, you'll most likely need these plugins. In
			// some cases you'll need additional configuration -
			// consult the documentation for details:
			// https://github.com/rollup/plugins/tree/master/packages/commonjs
			resolve({
				browser: true,
				dedupe: ["svelte"],
				exportConditions: ["svelte"],
			}),
			typescript({
				sourceMap: false,
				inlineSources: !production,
			}),
			commonjs(),
			// In dev mode, call `npm run start` once
			// the bundle has been generated
			!production && serve(),

			// Watch the `public` directory and refresh the
			// browser on changes when not in production
			!production && livereload("public"),

			// If we're building for production (npm run build
			// instead of npm run dev), minify
			production && terser(),
			copyFilePlugin('src/manifest.json', 'public/manifest.json'),
			copyFilePlugin('src/icons', 'public/icons'),
			copyFilePlugin('src/_locales', 'public/_locales')
		],
		watch: {
			clearScreen: false,
		},
	},
];
