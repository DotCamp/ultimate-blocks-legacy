const chokidar = require("chokidar");
const sass = require("node-sass");
const { writeFile } = require("fs");
const { transformFile } = require("@babel/core");
const { resolve } = require("path");
const { readdir } = require("fs").promises;

chokidar.watch("./src").on("all", (event, path) => {
	if (path.endsWith("front.js")) {
		transformFile(path, (err, result) => {
			if (err) console.log(err);
			else {
				writeFile(
					`${path.slice(0, path.lastIndexOf("\\"))}\\front.build.js`,
					result.code,
					err => {
						if (err) throw err;
					}
				);
			}
		});
	} else if (path.endsWith(".scss")) {
		if (path.endsWith("editor.scss") || path.endsWith("style.scss")) {
			sass.render(
				{
					file: path,
					outputStyle: "compressed"
				},
				function(error, result) {
					if (error) {
						console.log(error);
					} else {
						writeFile(
							path.replace(/.scss$/, ".css"),
							result.css.toString(),
							err => {
								if (err) throw err;
							}
						);
					}
				}
			);
		} else {
			(async () => {
				for await (const f of getFiles(__dirname + "\\src")) {
					if (f.endsWith("editor.scss") || f.endsWith("style.scss")) {
						sass.render(
							{
								file: f,
								outputStyle: "compressed"
							},
							function(error, result) {
								if (error) {
									console.log(error.status);
								} else {
									writeFile(
										f.replace(/.scss$/, ".css"),
										result.css.toString(),
										err => {
											if (err) throw err;
										}
									);
								}
							}
						);
					}
				}
			})();
		}
	}
});

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
