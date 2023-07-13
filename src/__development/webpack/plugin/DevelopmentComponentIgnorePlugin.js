// eslint-disable-next-line import/no-extraneous-dependencies
const process = require('process');
const ft = require('fancy-terminal');

/**
 * DEVELOPMENT
 *
 * Webpack plugin to ignore development related components.
 */
class DevelopmentComponentIgnorePlugin {
	/**
	 * Class constructor.
	 *
	 * @param {Array<string> | string} componentsToIgnore target components to ignore
	 * @param {boolean}                raiseError         whether to raise an error and exit process
	 */
	constructor(componentsToIgnore, raiseError = true) {
		if (!Array.isArray(componentsToIgnore)) {
			componentsToIgnore = [componentsToIgnore];
		}

		this.ignoreList = componentsToIgnore;
		this.raiseError = raiseError;
	}

	apply(compiler) {
		compiler.hooks.emit.tap(
			'DevelopmentComponentIgnorePlugin',
			(compilation) => {
				const { modules } = compilation;

				const foundComponents = [];
				const hasDevelopmentComponent = [...modules].reduce(
					(carry, module) => {
						const pattern = new RegExp(
							`import (${this.ignoreList.join('|')})`
						);

						if (
							module.originalSource &&
							typeof module.originalSource === 'function' &&
							module.originalSource()
						) {
							const match = pattern.exec(
								module.originalSource().source()
							);

							if (match) {
								const targetResourceFile = module.resource;
								foundComponents.push([
									targetResourceFile,
									match[1],
								]);
								carry = true;
							}
						}

						return carry;
					},
					false
				);

				if (hasDevelopmentComponent) {
					// eslint-disable-next-line array-callback-return
					foundComponents.map((matchArray) => {
						const [matchFile, matchComponent] = matchArray;

						const consoleMessage = `DevelopmentComponentIgnore ${
							this.raiseError ? 'Error' : 'Warning'
						}: Component [${matchComponent}] is present in ${matchFile}${
							this.raiseError ? ', remove it to continue...' : ''
						}`;

						const consoleMessageColor = this.raiseError
							? 'red'
							: 'yellow';

						// eslint-disable-next-line no-console
						console.error(ft[consoleMessageColor](consoleMessage));
					});

					if (this.raiseError) {
						process.exit(1);
					}
				}
			}
		);
	}
}

/**
 * @type {DevelopmentComponentIgnorePlugin}
 */
module.exports = DevelopmentComponentIgnorePlugin;
