const path = require( 'path' );

const packageJsonAliasMap = require( path.resolve( './package.json' ) ).alias;

module.exports = {
	extends: [ 'plugin:@wordpress/eslint-plugin/recommended' ],
	plugins: [ 'import' ],
	ignorePatterns: [ 'node_modules/', 'dist/', 'bundle-dist/', 'vendor/' ],
	parser: '@babel/eslint-parser',
	parserOptions: {
		requireConfigFile: false,
		babelOptions: {
			presets: [ '@babel/preset-react' ],
		},
	},
	rules: {
		'import/no-extraneous-dependencies': [ 'off' ],
	},
	settings: {
		'import/resolver': {
			webpack: {
				config: './webpack.config.js',
			},
			'eslint-import-resolver-custom-alias': {
				alias: packageJsonAliasMap,
				extensions: [ '.js', '.jsx' ],
			},
		},
	},
	overrides: [
		{
			files: [ '__tests__/js/unit/**/*.js' ],
			extends: [ 'plugin:testing-library/react' ],
			globals: {
				beforeEach: true,
				describe: true,
				expect: true,
				it: true,
			},
		},
	],
	globals: {
		self: true,
		ubPriorityData: true,
		UB_ENV: true,
		localStorage: true,
	},
};
