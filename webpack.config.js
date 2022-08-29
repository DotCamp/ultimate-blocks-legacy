const defaultConfig = require('@wordpress/scripts/config/webpack.config.js');
const path = require('path');
const IgnoreEmitPlugin = require('ignore-emit-webpack-plugin');
// eslint-disable-next-line import/no-extraneous-dependencies
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
	...defaultConfig,
	entry: {
		index: path.resolve(process.cwd(), 'src', 'blocks.js'),
	},
	resolve: {
		...defaultConfig.resolve,
		alias: {
			...defaultConfig.resolve.alias,
			$BlockStores: path.resolve(__dirname, 'src', 'stores'),
			$Inc: path.resolve(__dirname, 'src', 'inc'),
		},
		extensions: [...defaultConfig.resolve.extensions, '.js'],
	},
	plugins: [
		...defaultConfig.plugins.filter(
			(p) => !(p instanceof CleanWebpackPlugin)
		),
		new IgnoreEmitPlugin(['blocks.build.asset.php', 'blocks.build.js.map']),
	],
	output: {
		filename: 'blocks.build.js',
	},
};
