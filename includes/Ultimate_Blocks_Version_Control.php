<?php

namespace Ultimate_Blocks\includes;

use Ultimate_Blocks\includes\common\traits\Ajax_Response_Trait;
use Ultimate_Blocks\includes\common\traits\Manager_Base_Trait;
use function add_filter;
use function check_ajax_referer;
use function current_user_can;
use function plugins_api;

/**
 * Manager responsible for version related operations.
 */
class Ultimate_Blocks_Version_Control {
	use Manager_Base_Trait;
	use Ajax_Response_Trait;

	const VERSION_ROLLBACK_AJAX_ACTION = 'ub_version_control';

	/**
	 * Main process that will be called during initialization of manager.
	 *
	 * @return void
	 */
	protected function init_process() {
		add_filter( 'ub/filter/admin_settings_menu_data', [ $this, 'add_settings_menu_data' ] );
		add_action('wp_ajax_' . self::VERSION_ROLLBACK_AJAX_ACTION, [$this, 'ajax_version_rollback']);
	}

	/**
	 * Handle ajax version rollback requests.
	 * @return void
	 */
	public function ajax_version_rollback(  ) {
		if( current_user_can('manage_options') && check_ajax_referer(self::VERSION_ROLLBACK_AJAX_ACTION, 'nonce' ,false)){
			$this->set_message(esc_html__('we are in the right direction'));

		}else {
			$this->set_error(esc_html__('You are not authorized to use this ajax endpoint.', 'ultimate-blocks'));
		}

		$this->send_json();
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

		// TODO [ErdemBircan] remove transient operations for production
		$plugin_remote_info = get_transient( 'ub-dev-plugin-information' );

		if ( $plugin_remote_info === false ) {

			$plugin_remote_info = plugins_api( 'plugin_information', [
				'slug' => 'ultimate-blocks',
			] );

			set_transient( 'ub-dev-plugin-information', $plugin_remote_info );
		}


		$all_versions = $plugin_remote_info->versions;
		unset( $all_versions['trunk'] );

		$versions = array_slice( array_reverse( $all_versions, true ), 0, 5, true );

		$data['versionControl'] = [
			'currentVersion' => $current_version,
			'versions'       => $versions,
			'ajax' => [
				'versionRollback' => [
					'url' => get_admin_url(null, 'admin-ajax.php'),
					'action' => self::VERSION_ROLLBACK_AJAX_ACTION,
					'nonce' => wp_create_nonce(self::VERSION_ROLLBACK_AJAX_ACTION),
				]
			]
		];

		return $data;
	}
}
