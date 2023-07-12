// eslint-disable-next-line import/no-extraneous-dependencies
const process = require('process');
const ft = require('fancy-terminal');

/**
 * DEVELOPMENT
 *
 * Webpack plugin to ignore development related components.
 */
class DevelopmentComponentIgnore {
	/**
	 * Class constructor.
	 *
	 * @param {Array<string> | string} componentsToIgnore target components to ignore
	 */
	constructor(componentsToIgnore) {
		if (!Array.isArray(componentsToIgnore)) {
			componentsToIgnore = [componentsToIgnore];
		}

		this.ignoreList = componentsToIgnore;
	}

	apply(compiler) {
		compiler.hooks.emit.tap('DevelopmentComponentIgnore', (compilation) => {
			const { assets } = compilation;

			const foundComponents = [];
			const hasDevelopmentComponent = Object.keys(assets).some(
				(assetName) => {
					const pattern = new RegExp(
						`import (${this.ignoreList.join('|')})`
					);
					const match = pattern.exec(assets[assetName].source());
					if (match) {
						foundComponents.push(match[1]);
					}

					return match !== null;
				}
			);

			if (hasDevelopmentComponent) {
				// eslint-disable-next-line no-console
				console.error(
					ft.red(
						`DevelopmentComponentIgnore Error: Component${
							foundComponents.length > 1 ? 's' : ''
						} [${foundComponents.join(
							', '
						)}] is present in bundle, remove it to continue...`
					)
				);
				process.exit(1);
			}
		});
	}
}

/**
 * @type {DevelopmentComponentIgnore}
 */
module.exports = DevelopmentComponentIgnore;
