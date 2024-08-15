const fs = require('fs');
const ft = require('fancy-terminal');
// eslint-disable-next-line import/no-extraneous-dependencies
const process = require('process');
const path = require('path');
const archiver = require('archiver');
const { version } = require('./package.json');

/**
 * Get current time in nanoseconds.
 *
 * @return {number} current time in nanoseconds
 */
function getHrTime() {
	const [seconds, nanoseconds] = process.hrtime();
	return seconds * 1e9 + nanoseconds;
}

/**
 * Compress plugin into a zip file.
 *
 * @param {string} outputPath  path to the output zip file
 * @param {Array}  excludeList list of files/directories to be excluded from the zip file
 */
async function compress(outputPath, excludeList) {
	const startTime = getHrTime();

	const zip = archiver('zip', {
		zlib: { level: 9 },
	});

	const output = fs.createWriteStream(outputPath);

	// handle errors
	output.on('error', (err) => {
		// eslint-disable-next-line no-console
		console.log(err);
	});

	// handle the end event
	output.on('close', () => {
		const endTime = getHrTime();
		const elapsedTime = (endTime - startTime) / 1e9;

		const bytes = zip.pointer();
		const zipSize = bytes / 1024 / 1024;

		const fileName = path.basename(outputPath);

		// eslint-disable-next-line no-console
		console.log(
			`${ft.green(fileName)}: ${ft.blue(
				zipSize.toFixed(2)
			)}MB, generated in ${ft.blue(elapsedTime.toFixed(2))}ms`
		);
	});

	zip.pipe(output);
	zip.glob('**/*.*', {
		cwd: __dirname,
		ignore: excludeList,
	});
	await zip.finalize();
}

/**
 * Generate ignore list for files/directories to be excluded from the zip file.
 *
 * @return {(string|*)[]} list of files/directories to be excluded from the zip file
 */
const generateIgnoreList = () => {
	// read both .gitignore and .compressignore to exclude files
	const gitignore = fs.readFileSync('.gitignore').toString().split('\n');
	const compressIgnore = fs
		.readFileSync('.compressignore')
		.toString()
		.split('\n');

	return compressIgnore
		.concat(gitignore)
		.filter((val) => val !== '')
		.map((ignorePath) => {
			return ignorePath.endsWith('/') ? ignorePath + '**' : ignorePath;
		});
};

/**
 * Write version info to a JSON file.
 *
 * @param {string} outputPath  path to version info file
 * @param {string} zipFilePath path to zip file
 */
const writeFileInfo = (outputPath, zipFilePath) => {
	const { size } = fs.statSync(zipFilePath);

	const currentEnv = process.env.NODE_ENV || 'development';
	const writeData = {
		version,
		mode: currentEnv,
		size: `${(size / 1024 / 1024).toFixed(2)}mb`,
		date: new Date().toISOString(),
	};
	fs.writeFileSync(
		path.join(outputPath, 'info.json'),
		JSON.stringify(writeData, null, 2)
	);
};

const outputPath = path.resolve(__dirname, 'zip');
const targetFileName = process.argv[process.argv.length - 1];
const zipOutputPath = path.join(outputPath, targetFileName);
const ignoreList = generateIgnoreList();

// compress plugin
(async () => {
	await compress(zipOutputPath, ignoreList);
	writeFileInfo(outputPath, zipOutputPath);
})();
