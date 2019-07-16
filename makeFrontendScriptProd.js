const { transformFileSync } = require('@babel/core');

const {
	readdirSync,
	statSync,
	existsSync,
	readFileSync,
	writeFileSync
} = require('fs');
const { join } = require('path');

const dirs = p =>
	readdirSync(p).filter(f => statSync(join(p, f)).isDirectory());

const blocks = dirs(__dirname + '/src/blocks');

blocks.forEach(block => {
	const blockDir = __dirname + '/src/blocks/' + block;
	if (existsSync(blockDir + '/front.js')) {
		writeFileSync(
			blockDir + '/front.build.js',
			transformFileSync(blockDir + '/front.js').code
		);
		writeFileSync(
			blockDir + '/block.php',
			readFileSync(blockDir + '/block.php', 'utf8').replace(
				'front.js',
				'front.build.js'
			)
		);
	}
});
