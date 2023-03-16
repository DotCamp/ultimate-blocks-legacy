const chokidar = require("chokidar");
const { renderSync } = require("sass");
const {
	readFileSync,
	promises: { readdir, writeFile, readFile }
} = require("fs");
const { transformFileAsync } = require("@babel/core");
const { resolve, basename } = require("path");

function convertToEs5(file) {
	transformFileAsync(file)
		.then(result => {
			const target = `${file.replace(/front\.js$/, "front.build.js")}`;

			readFile(target, "utf-8")
				.then(data => {
					if (data !== result.code) {
						writeFile(target, result.code).catch(err => {
							throw err;
						});
					}
				})
				.catch(err => {
					if (err.code === "ENOENT") {
						writeFile(target, result.code).catch(err => {
							throw err;
						});
					} else throw err;
				});
		})
		.catch(err => console.log(err));
}

chokidar
	.watch("./src/blocks/*/front.js")
	.on("add", file => convertToEs5(file))
	.on("change", file => convertToEs5(file));

function generateWholeCSS() {
	const compileAll = new Promise((resolve, reject) => {
		(async () => {
			let newEditorStyle = "";
			let newFrontendStyle = "";
			for await (const f of getFiles(__dirname + "/src")) {
				if (f.endsWith("editor.scss") || f.endsWith("style.scss")) {
					try {
						const result = renderSync({
							file: f,
							outputStyle: "compressed"
						}).css.toString();
						const target = f.replace(/\.scss$/, ".css");

						if (f.endsWith("editor.scss")) {
							newEditorStyle += result;
						} else newFrontendStyle += result;

						readFile(target, "utf-8")
							.then(data => {
								if (data !== result.code) {
									writeFile(target, result).catch(err => reject(err));
								}
							})
							.catch(err => {
								if (err.code === "ENOENT") {
									writeFile(target, result).catch(err => reject(err));
								} else reject(err);
							});
					} catch (err) {
						reject(err);
					}
				}
			}
			resolve({ newEditorStyle, newFrontendStyle });
		})();
	});
	compileAll
		.then(({ newEditorStyle, newFrontendStyle }) => {
			const editorCSSLoc = `${__dirname}/dist/blocks.editor.build.css`;
			readFile(editorCSSLoc, "utf-8")
				.then(data => {
					if (data !== newEditorStyle) {
						writeFile(editorCSSLoc, newEditorStyle).catch(err => {
							throw err;
						});
					}
				})
				.catch(err => {
					throw err;
				});

			const frontendCSSLoc = `${__dirname}/dist/blocks.style.build.css`;
			readFile(frontendCSSLoc, "utf-8")
				.then(data => {
					if (data !== newFrontendStyle) {
						writeFile(frontendCSSLoc, newFrontendStyle).catch(err => {
							throw err;
						});
					}
				})
				.catch(err => {
					throw err;
				});
		})
		.catch(err => console.log(err));
}

function checkFile(path) {
	if (path.endsWith("editor.scss") || path.endsWith("style.scss")) {
		const receiveNewVersion = new Promise((resolve, reject) => {
			const result = renderSync({
				file: path,
				outputStyle: "compressed"
			}).css.toString();
			const target = path.replace(/\.scss$/, ".css");

			readFile(target, "utf-8")
				.then(data => {
					if (data !== result) {
						writeFile(target, result).catch(err => reject(err));
					}
				})
				.catch(err => {
					if (err.code === "ENOENT") {
						writeFile(target, result).catch(err => reject(err));
					} else reject(err);
				});
			resolve({ path: target, result });
		});

		receiveNewVersion
			.then(({ path, result }) => {
				(async () => {
					let revisedFile = "";
					for await (const f of getFiles(__dirname + "/src")) {
						try {
							if (basename(f) === basename(path)) {
								revisedFile += f.includes(path)
									? result
									: readFileSync(f, "utf-8");
							}
						} catch (err) {
							throw err;
						}
					}

					const compiledFileLoc = `${__dirname}/dist/blocks.${basename(
						path,
						".css"
					)}.build.css`;
					readFile(compiledFileLoc, "utf-8")
						.then(data => {
							if (data !== revisedFile) {
								writeFile(compiledFileLoc, revisedFile).catch(err => {
									throw err;
								});
							}
						})
						.catch(err => {
							throw err;
						});
				})();
			})

			.catch(err => {
				throw err;
			});
	} else generateWholeCSS();
}

chokidar
	.watch(["./src/*.scss", "./src/blocks/**/*.scss", "./src/styles/**/*.scss"], {
		ignoreInitial: true
	})
	.on("change", path => checkFile(path))
	.on("add", path => checkFile(path))
	.on("unlink", _ => generateWholeCSS())
	.on("ready", _ => generateWholeCSS());

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
