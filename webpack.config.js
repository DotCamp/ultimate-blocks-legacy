const defaultConfig = require('@wordpress/scripts/config/webpack.config.js');
const path = require('path');
const IgnoreEmitPlugin = require('ignore-emit-webpack-plugin');
// eslint-disable-next-line import/no-extraneous-dependencies
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
	...defaultConfig,
	entry: {
		blocks: path.resolve(process.cwd(), 'src', 'blocks.js'),
		priority: path.resolve(process.cwd(), 'src', 'priority.js'),
	},
	resolve: {
		...defaultConfig.resolve,
		alias: {
			...defaultConfig.resolve.alias,
			$BlockStores: path.resolve(__dirname, 'src', 'stores'),
			$Inc: path.resolve(__dirname, 'src', 'inc'),
			$Base: path.resolve(__dirname, 'src', 'base'),
			$Library: path.resolve(__dirname, 'library'),
		},
		extensions: [...defaultConfig.resolve.extensions, '.js'],
	},
	plugins: [
		...defaultConfig.plugins.filter(
			(p) => !(p instanceof CleanWebpackPlugin)
		),
		new IgnoreEmitPlugin(['blocks.build.asset.php', /\.map$/]),
	],
	output: {
		filename: '[name].build.js',
	},
};
