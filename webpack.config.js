const defaultConfig = require("@wordpress/scripts/config/webpack.config.js");
const path = require("path");
const IgnoreEmitPlugin = require("ignore-emit-webpack-plugin");

module.exports = {
	...defaultConfig,
	entry: {
		index: path.resolve(process.cwd(), "src", "blocks.js")
	},
	plugins: [
		...defaultConfig.plugins,
		new IgnoreEmitPlugin(["blocks.build.asset.php", "blocks.build.js.map"])
	],
	output: {
		filename: "blocks.build.js"
	}
};
