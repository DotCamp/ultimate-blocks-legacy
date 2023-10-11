module.exports = function ( api ) {
	api.cache( true );
	return {
		presets: [ '@babel/preset-env', '@babel/preset-react' ],
		plugins: [
			'@babel/plugin-proposal-class-properties',
			[
				'babel-plugin-module-resolver',
				{
					alias: {
						$Containers: './admin/js/src/containers',
						$Components: './admin/js/src/components',
						$AdminInc: './admin/js/src/inc',
						$Data: './admin/js/src/data',
						$HOC: './admin/js/src/hoc',
						$Stores: './admin/js/src/stores',
						$Styles: './admin/css/src/',
						$Library: './library',
						$EditorComponents: './src/inc/components',
					},
				},
			],
		],
	};
};
