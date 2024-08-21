const sass = require("sass");
const { writeFile, writeFileSync } = require("fs");
const { transformFileSync } = require("@babel/core");
const { resolve } = require("path");
const { readdir } = require("fs").promises;

(async () => {
	let newEditorStyle = "";
	let newFrontendStyle = "";
	for await (const f of getFiles(__dirname + "/src")) {
		if (f.endsWith("editor.scss") || f.endsWith("style.scss")) {
			try {
				const result = sass.renderSync({
					file: f,
					outputStyle: "compressed"
				});
				writeFileSync(f.replace(/\.scss$/, ".css"), result.css.toString());
				if (f.endsWith("editor.scss")) {
					newEditorStyle += result.css.toString();
				} else {
					newFrontendStyle += result.css.toString();
				}
			} catch (err) {
				console.log(err);
			}
		} else if (f.endsWith("front.js")) {
			try {
				writeFileSync(
					`${f.replace(/front\.js$/, "front.build.js")}`,
					transformFileSync(f).code
				);
			} catch (err) {
				console.log(err);
			}
		}
	}

	writeFile(
		`${__dirname}/dist/blocks.editor.build.css`,
		newEditorStyle,
		{ flag: "w+" },
		err => {
			if (err) throw err;
		}
	);
	writeFile(
		`${__dirname}/dist/blocks.style.build.css`,
		newFrontendStyle,
		{ flag: "w+" },
		err => {
			if (err) throw err;
		}
	);
})();

//taken from qwtel at https://stackoverflow.com/a/45130990
async function* getFiles(dir) {
	const dirents = await readdir(dir, { withFileTypes: true });
	for (const dirent of dirents) {
		const res = resolve(dir, dirent.name);
		if (dirent.isDirectory()) {
			yield* getFiles(res);
		} else {
			yield res;
		}
	}
}
