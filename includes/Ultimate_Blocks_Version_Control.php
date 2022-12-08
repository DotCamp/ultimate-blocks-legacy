<?php

namespace Ultimate_Blocks\includes;

use Exception;
use Plugin_Upgrader;
use stdClass;
use Ultimate_Blocks\includes\common\traits\Ajax_Response_Trait;
use Ultimate_Blocks\includes\common\traits\Manager_Base_Trait;
use WP_Error;
use function activate_plugin;
use function add_filter;
use function check_ajax_referer;
use function current_user_can;
use function get_admin_url;
use function get_plugin_data;
use function is_wp_error;
use function plugins_api;
use function wp_create_nonce;

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
		add_action( 'wp_ajax_' . self::VERSION_ROLLBACK_AJAX_ACTION, [ $this, 'ajax_version_rollback' ] );
	}

	/**
	 * Handle ajax version rollback requests.
	 * @return void
	 */
	public function ajax_version_rollback() {
		if ( current_user_can( 'manage_options' ) && check_ajax_referer( self::VERSION_ROLLBACK_AJAX_ACTION, 'nonce',
				false ) ) {

			try {
				if ( ! isset( $_POST['version'] ) ) {
					throw new Exception( esc_html__( 'Invalid request body.', 'ultimate-blocks' ) );
				}

				$target_version         = $_POST['version'];
				$current_plugin_version = $this->current_plugin_version();

				if($target_version === $current_plugin_version){
					throw new Exception(esc_html__('You are on the same plugin version.', 'ultimate-blocks'));
				}

				$available_versions     = $this->get_plugin_versions_info();

				if ( ! in_array( $target_version, array_keys( $available_versions ) ) ) {
					throw new Exception( esc_html__( 'Target version is out of bounds.', 'ultimate-blocks' ) );
				}

				require_once( ABSPATH . 'wp-admin/includes/file.php' );
				require_once( ABSPATH . 'wp-admin/includes/misc.php' );
				require_once( ABSPATH . 'wp-admin/includes/class-wp-upgrader.php' );
				require_once( ABSPATH . 'wp-admin/includes/class-plugin-upgrader.php' );

				$download_url = $available_versions[ $target_version ];
				$upgrader     = new Plugin_Upgrader( new Version_Control_Upgrader_Skin( [] ) );

				add_filter( 'upgrader_package_options', function ( $options ) use ( $target_version ) {
					$options['abort_if_destination_exists'] = false;
					$options['hook_extra']                  = array_merge( $options['hook_extra'], [
						'plugin'  => 'ultimate-blocks/ultimate-blocks.php',
						'version' => $target_version
					] );

					return $options;
				} );
				$install_result = $upgrader->install( $download_url, [ 'overwrite_package' => true ] );
				if ( is_wp_error( $install_result ) || $install_result === false ) {
					throw new Exception( esc_html__( 'An error occurred during rollback operation, try again later.',
						'ultimate-blocks' ) );
				} else {
					activate_plugin( 'ultimate-blocks/ultimate-blocks.php' );
					$this->set_message( esc_html__( sprintf( 'Plugin version %1$s installed successfully.',
						$target_version ), 'ultimate-blocks' ) );
				}
			} catch ( Exception $e ) {
				$this->set_error( $e->getMessage() );
			}
		} else {
			$this->set_error( esc_html__( 'You are not authorized to use this ajax endpoint.', 'ultimate-blocks' ) );
		}

		$this->send_json();
	}

	/**
	 * Get plugin versions info.
	 *
	 * @return array versions info
	 */
	private function get_plugin_versions_info() {
		require_once ABSPATH . 'wp-admin/includes/plugin-install.php';

		$plugin_remote_info = plugins_api( 'plugin_information', [
			'slug' => 'ultimate-blocks',
		] );

		if ( is_wp_error( $plugin_remote_info ) ) {
			$all_versions = [];
		} else {
			$all_versions = $plugin_remote_info->versions;
			unset( $all_versions['trunk'] );
		}

		return array_slice( array_reverse( $all_versions, true ), 0, 5, true );
	}

	/**
	 * Current version of our plugin.
	 * @return string version
	 */
	private function current_plugin_version() {
		return get_plugin_data( trailingslashit( ULTIMATE_BLOCKS_PATH ) . 'ultimate-blocks.php' )['Version'];
	}

	/**
	 * Add version control related data to settings menu frontend.
	 *
	 * @param array $data data
	 *
	 * @return array filtered data
	 */
	public function add_settings_menu_data( $data ) {
		$current_version = $this->current_plugin_version();

		$versions = array_keys( $this->get_plugin_versions_info() );

		$data['versionControl'] = [
			'currentVersion' => $current_version,
			'versions'       => $versions,
			'ajax'           => [
				'versionRollback' => [
					'url'    => get_admin_url( null, 'admin-ajax.php' ),
					'action' => self::VERSION_ROLLBACK_AJAX_ACTION,
					'nonce'  => wp_create_nonce( self::VERSION_ROLLBACK_AJAX_ACTION ),
				]
			]
		];

		return $data;
	}
}
