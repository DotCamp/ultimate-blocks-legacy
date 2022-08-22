<?php

namespace Ultimate_Blocks\includes;

use Ultimate_Blocks\includes\common\traits\Manager_Base_Trait;
use function add_filter;
use function plugins_api;

/**
 * Manager responsible for version related operations.
 */
class Ultimate_Blocks_Version_Control {
	use Manager_Base_Trait;

	/**
	 * Main process that will be called during initialization of manager.
	 *
	 * @return void
	 */
	protected function init_process() {
		add_filter( 'ub/filter/admin_settings_menu_data', [ $this, 'add_settings_menu_data' ] );
	}

	/**
	 * Add version control related data to settings menu frontend.
	 *
	 * @param array $data data
	 *
	 * @return array filtered data
	 */
	public function add_settings_menu_data( $data ) {
		require_once ABSPATH . 'wp-admin/includes/plugin-install.php';

		$current_version = get_plugin_data( trailingslashit( ULTIMATE_BLOCKS_PATH ) . 'ultimate-blocks.php' )['Version'];

		$plugin_remote_info = plugins_api( 'plugin_information', [
			'slug' => 'ultimate-blocks',
		] );

		$all_versions = $plugin_remote_info->versions;
		unset( $all_versions['trunk'] );

		$versions = array_slice( array_reverse( $all_versions, true ), 0, 5, true );

		$data['versionControl'] = [
			'currentVersion' => $current_version,
			'versions'       => $versions,
		];

		return $data;
	}
}
