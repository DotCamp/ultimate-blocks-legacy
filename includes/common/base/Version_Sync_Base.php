<?php

namespace Ultimate_Blocks\includes\common\base;

use Plugin_Upgrader;
use Ultimate_Blocks\includes\Version_Control_Upgrader_Skin;
use Ultimate_Blocks\includes\Version_Sync_Manager;
use WP_Error;
use function add_filter;

// if called directly, abort
if ( ! defined( 'WPINC' ) ) {
	die();
}

/**
 * Class Version_Sync_Base.
 *
 * Abstract class for version sync operations for base plugin and its addons.
 */
abstract class Version_Sync_Base {
	/**
	 * Minute in seconds.
	 */
	const MINUTE_IN_SECONDS = 60;

	/**
	 * Check availability of version sync manager.
	 * @return bool status
	 */
	private function check_version_sync_manager_availability() {
		return class_exists( '\Ultimate_Blocks\includes\Version_Sync_Manager' );
	}

	/**
	 * Get slug of plugin/addon used in its distribution API.
	 * @return string slug
	 */
	abstract public function get_version_slug();

	/**
	 * Get text domain of the plugin.
	 *
	 * It will be used for ajax upgraders to identify our plugin since slug is not supplied in plugin info property of that upgrader skin.
	 * @return string
	 */
	abstract public function get_text_domain();

	/**
	 * Parse version number from package url.
	 *
	 * @param string $package package url
	 *
	 * @return string|null version number
	 */
	abstract public function parse_version_from_package( $package );

	/**
	 * Plugin __FILE__
	 * @return string plugin file
	 */
	abstract public function plugin_file();

	/**
	 * Callback hook for version sync manager when a subscriber attempted an installation operation.
	 *
	 * @param string $slug subscriber slug
	 * @param string $version version to install
	 *
	 * @return false|WP_Error false to permit install(I know, but it is what it is) or WP_Error to cancel it
	 */
	abstract public function version_sync_logic( $slug, $version );

	/**
	 * Subscribe to version events of version sync manager.
	 */
	public final function subscribe_to_version_sync() {
		if ( $this->check_version_sync_manager_availability() ) {
			Version_Sync_Manager::subscribe( $this->get_version_slug(), $this );
		}
	}

	/**
	 * Plugin specific logic for fetching versions and their info.
	 *
	 * Use plugin version for keys and info for their values. Use 'url' property key for download link.
	 * @return array|WP_Error versions array
	 */
	abstract protected function get_plugin_versions();

	/**
	 * Get All available plugin versions and their infos.
	 *
	 * To minimize API calls , this function will set the value of versions info as a transient object with an expiration timer.
	 *
	 * @param bool $force force to fetch versions from remote Freemius API
	 *
	 * @return WP_Error|array plugin versions
	 */
	protected final function plugin_versions( $force = false ) {
		$transient_key = 'ub-' . $this->get_version_slug() . '-versions-info';
		$versions_info = false;

		// get cached version if force options is disabled
		if ( ! $force ) {
			$versions_info = get_transient( $transient_key );
		}

		if ( $versions_info === false || ! is_array( $versions_info ) ) {
			// use extending components implemented function to fetch version info
			$versions_info = $this->get_plugin_versions();

			// if an error occurred on fetch process, don't update transient value
			if ( ! is_wp_error( $versions_info ) ) {
				// 10 minute expiration timer for transient data
				set_transient( $transient_key, $versions_info, 10 * self::MINUTE_IN_SECONDS );
			}
		}

		return $versions_info;
	}


	/**
	 * Install a version of subscriber.
	 *
	 * @param string $calling_slug slug of calling plugin
	 * @param string $version version to install
	 */
	public function install( $calling_slug, $version ) {
		$current_version = get_plugin_data( $this->plugin_file() ) ['Version'];

		// only continue to install process if version is different from the current one
		if ( $version !== $current_version ) {
			$relative_path = str_replace( trailingslashit( WP_PLUGIN_DIR ), '', $this->plugin_file() );
			$versions      = $this->plugin_versions();
			if ( isset( $versions[ $version ] ['url'] ) ) {
				$this->install_version( $relative_path, $versions[ $version ] ['url'] );
			}
		}
	}

	/**
	 * Install version of plugin.
	 *
	 * @param string $relative_path relative path of entry file of plugin to plugin directory
	 * @param string $package_url package url
	 * @param bool $trigger_sync_manager whether this installation process should also trigger version sync manager
	 *
	 * @return bool|WP_Error true on success, false or WP_Error on failure
	 */
	protected final function install_version( $relative_path, $package_url, $trigger_sync_manager = false ) {
		require_once( ABSPATH . 'wp-admin/includes/file.php' );
		require_once( ABSPATH . 'wp-admin/includes/misc.php' );
		require_once( ABSPATH . 'wp-admin/includes/class-wp-upgrader.php' );
		require_once( ABSPATH . 'wp-admin/includes/class-plugin-upgrader.php' );

		// instantiate plugin upgrader with a custom upgrader skin
		$upgrader = new Plugin_Upgrader( new Version_Control_Upgrader_Skin( [],
			[ Version_Sync_Manager::UB_VERSION_SYNC_TRIGGER => false ] ) );

		add_filter( 'upgrader_package_options', function ( $options ) use ( $relative_path, $trigger_sync_manager ) {
			$options['abort_if_destination_exists'] = false;
			$options['hook_extra']                  = array_merge( $options['hook_extra'], [
				'plugin'                                      => $relative_path,
				Version_Sync_Manager::UB_VERSION_SYNC_TRIGGER => $trigger_sync_manager
			] );

			return $options;
		} );

		return $upgrader->install( $package_url, [ 'overwrite_package' => true ] );
	}

	/**
	 * Check if supplied version is within limits of defined pro versions.
	 *
	 * @param string $version version number to check
	 * @param array $versions_info versions info array
	 *
	 * @return bool within limits or not
	 */
	protected final function is_within_defined_version_limits( $version, $versions_info ) {
		return in_array( $version, array_keys( $versions_info ) );
	}

	/**
	 * Generic sync logic that can be used for common install operations.
	 *
	 * @param string $slug subscriber slug
	 * @param string $version version to install
	 *
	 * @return bool|WP_Error false for approval or WP_Error on failure
	 */
	protected final function generic_sync_logic( $slug, $version ) {
		// override this value for return values of separate version sync logic results
		$return_value = false;

		// get all available plugin versions
		$versions_info = $this->plugin_versions();

		if ( is_wp_error( $versions_info ) ) {
			return $return_value;
		}

		// version is within limits of pro versions
		if ( $this->is_within_defined_version_limits( $version, $versions_info ) ) {
			$return_value = false;
		} elseif ( version_compare( $version, $this->highest_lowest_version_available( false ), '>' ) ) {
			// force fetch versions info to check for a last minute latest pro version update
			$this->plugin_versions( true );

			// no update found, give error
			if ( $version !== $this->highest_lowest_version_available( false ) ) {
				$return_value = new WP_Error( 501,
					sprintf( esc_html__( 'Version mismatch: Version %s is not available for  %s, please check for an update later.',
						'ultimate-blocks' ), $version, $this->get_version_slug() ) );
			} else {
				// update found
				$return_value = false;
			}
		} else {
			// version in check is out of stable bounds of pro addon
			$return_value = new WP_Error( 501,
				sprintf( esc_html__( 'Version mismatch: Version %s is not available for %s.', 'ultimate-blocks' ),
					$version, $this->get_version_slug() ) );
		}

		return $return_value;
	}

	/**
	 * Highest/Lowest version available for pro.
	 *
	 * @param bool $lowest get the lowest version, if not will get highest
	 * @param null|array $versions versions info array to use, if not supplied, version infos will be fetched.
	 *
	 * @return string lowest version available
	 */
	public final function highest_lowest_version_available( $lowest = true, $versions = null ) {
		$array_to_use = $versions;

		if ( $array_to_use === null || ! is_array( $array_to_use ) ) {
			// if no versions array is supplied, fetch versions info from api
			$array_to_use = $this->plugin_versions();

			if ( is_wp_error( $array_to_use ) ) {
				$array_to_use = [];
			}
		}

		$operator = $lowest ? '<' : '>';

		return array_reduce( array_keys( $array_to_use ), function ( $carry, $version ) use ( $operator ) {
			return $carry === null ? $version : ( version_compare( $carry, $version, $operator ) ? $carry : $version );
		}, null );
	}
}
