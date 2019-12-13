const chokidar = require("chokidar");
const sass = require("node-sass");
const { writeFile, readFile } = require("fs");
const { transformFile } = require("@babel/core");
const { resolve } = require("path");
const { readdir } = require("fs").promises;

chokidar.watch("./src").on("all", (event, path) => {
	if (path.endsWith("front.js")) {
		transformFile(path, (err, result) => {
			if (err) console.log(err);
			else {
				const target = `${path.slice(
					0,
					path.lastIndexOf("\\")
				)}\\front.build.js`;
				readFile(target, "utf-8", (err, data) => {
					if (err) {
						if (err.code === "ENOENT") {
							writeFile(target, result.code, err => {
								if (err) throw err;
							});
						} else {
							throw err;
						}
					} else if (data !== result.code) {
						writeFile(target, result.code, err => {
							if (err) throw err;
						});
					}
				});
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
						const target = path.replace(/.scss$/, ".css");
						readFile(target, "utf-8", (err, data) => {
							if (err) {
								if (err.code === "ENOENT") {
									writeFile(target, result.css.toString(), err => {
										if (err) throw err;
									});
								} else {
									throw err;
								}
							} else if (data !== result.code) {
								writeFile(target, result.css.toString(), err => {
									if (err) throw err;
								});
							}
						});
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
									const target = f.replace(/.scss$/, ".css");
									readFile(target, "utf-8", (err, data) => {
										if (err) {
											if (err.code === "ENOENT") {
												writeFile(target, result.css.toString(), err => {
													if (err) throw err;
												});
											} else {
												throw err;
											}
										} else if (data !== result.css.toString()) {
											writeFile(target, result.css.toString(), err => {
												if (err) throw err;
											});
										}
									});
								}
							}
						);
					}
				}
			})();
		}
		let newEditorStyle = "";
		let newFrontendStyle = "";
		(async () => {
			for await (const f of getFiles(__dirname + "\\src")) {
				if (f.endsWith("editor.css")) {
					readFile(f, "utf-8", (err, data) => {
						if (err) throw err;
						newEditorStyle += data;
					});
				} else if (f.endsWith("style.css")) {
					readFile(f, "utf-8", (err, data) => {
						if (err) throw err;
						newFrontendStyle += data;
					});
				}
			}

			const editorCSSLoc = `${__dirname}\\dist\\blocks.editor.build.css`;
			readFile(editorCSSLoc, "utf-8", (err, data) => {
				if (err) throw err;
				if (data !== newEditorStyle) {
					writeFile(editorCSSLoc, newEditorStyle, err => {
						if (err) throw err;
					});
				}
			});

			const frontendCSSLoc = `${__dirname}\\dist\\blocks.style.build.css`;
			readFile(frontendCSSLoc, "utf-8", (err, data) => {
				if (err) throw err;
				if (data !== newFrontendStyle) {
					writeFile(frontendCSSLoc, newFrontendStyle, err => {
						if (err) throw err;
					});
				}
			});
		})();
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
