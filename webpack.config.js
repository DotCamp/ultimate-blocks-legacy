const defaultConfig = require('@wordpress/scripts/config/webpack.config.js');
const path = require('path');
const IgnoreEmitPlugin = require('ignore-emit-webpack-plugin');
// eslint-disable-next-line import/no-extraneous-dependencies
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
// eslint-disable-next-line import/no-extraneous-dependencies
const { DefinePlugin } = require('webpack');
const DevelopmentComponentIgnorePlugin = require('./src/__development/webpack/plugin/DevelopmentComponentIgnorePlugin');

// ignore list to mark given components as development specific
const developmentComponentIgnoreList = [
	'ActivateBlockOnStartup',
	'DevelopmentComponent',
];

const customConfig = {
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
			$Manager: path.resolve(__dirname, 'src', 'inc', 'managers'),
			$Development: path.resolve(__dirname, 'src', '__development'),
		},
		extensions: [...defaultConfig.resolve.extensions, '.js'],
	},
	plugins: [
		...defaultConfig.plugins.filter(
			(p) => !(p instanceof CleanWebpackPlugin)
		),
		new IgnoreEmitPlugin(['blocks.build.asset.php', /\.map$/]),
		new DefinePlugin({
			UB_ENV: JSON.stringify(defaultConfig.mode),
		}),
		new DevelopmentComponentIgnorePlugin(
			developmentComponentIgnoreList,
			defaultConfig.mode === 'production'
		),
	],
	output: {
		filename: '[name].build.js',
	},
};

module.exports = customConfig;
