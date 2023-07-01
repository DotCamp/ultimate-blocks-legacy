<?php

namespace Ultimate_Blocks\includes;

use Ultimate_Blocks\includes\common\traits\Manager_Base_Trait;
use WP_Error;
use function add_filter;
use function delete_transient;
use function get_transient;
use function is_wp_error;
use function set_transient;

// if called directly, abort
if ( ! defined( 'WPINC' ) ) {
	die();
}

/**
 * Manager for version synchronization.
 */
class Version_Sync_Manager {
	use Manager_Base_Trait;

	/**
	 * Subscribers list.
	 *
	 * This array will contain subscriber slug name as keys and instances as values.
	 * @var array
	 */
	private static $subscribers = [];

	/**
	 * Seconds in an hour
	 */
	const HOUR_IN_SECONDS = 60 * 60;

	/**
	 * Error transient key.
	 */
	const VERSION_SYNC_ERROR_TRANSIENT_KEY = 'ultimate-blocks-version-sync-error';

	/**
	 * Version sync trigger key for upgrader skin.
	 */
	const UB_VERSION_SYNC_TRIGGER = 'ub-version-sync-trigger';

	/**
	 * Main process that will be called during initialization of manager.
	 *
	 * @return void
	 */
	protected function init_process() {
		add_filter( 'upgrader_pre_download', [ __CLASS__, 'call_subs' ], 10, 3 );

		static::show_error_message();
	}

	/**
	 * If supplied id is a subscriber.
	 *
	 * @param string $sub_id subscriber id
	 *
	 * @return bool is subscribed or not
	 */
	private static function is_subscribed( $sub_id ) {
		return isset( static::$subscribers[ $sub_id ] );
	}

	/**
	 * Get a subscriber.
	 *
	 * @param string $sub_id subscriber id
	 *
	 * @return object|null subscriber context or null if no subscriber is found
	 */
	private static function get_subscriber( $sub_id ) {
		$sub = null;

		if ( static::is_subscribed( $sub_id ) ) {
			$sub = static::$subscribers[ $sub_id ];
		}

		return $sub;
	}

	/**
	 * Call subscribers.
	 *
	 * Subscribers will be called at every time an update/downgrade package is started downloading through WordPress upgrader methods. This filter hook will be used as a short circuit to continue/stop current update process depending on values available and responses gathered from subscribers of the manager.
	 *
	 * @param bool $status status of download
	 * @param string $package package url
	 * @param Object $context upgrader class context
	 *
	 * @return bool|WP_Error status of download process
	 */
	public static function call_subs( $status, $package, $context ) {
		$final_status = $status;

		if ( is_object( $context ) && property_exists( $context, 'skin' ) ) {
			$upgrader_skin = $context->skin;

			if ( property_exists( $upgrader_skin, 'plugin_info' ) ) {
				$plugin_info = (array) $upgrader_skin->plugin_info;

				// short circuit sub calling if current installation process marked as not to trigger version sync manager
				if ( isset( $plugin_info[ self::UB_VERSION_SYNC_TRIGGER ] ) && $plugin_info[ self::UB_VERSION_SYNC_TRIGGER ] === false ) {
					return $final_status;
				}

				if ( isset( $plugin_info['slug'] ) && $plugin_info['slug'] !== null ) {
					$slug = $plugin_info['slug'];
				} elseif ( isset( $plugin_info['TextDomain'] ) ) {
					$slug = $plugin_info['TextDomain'];
				}

				if ( $slug === null ) {
					return $final_status;
				}

				// @deprecated
				// for WP versions 4.9-5.0.2 there is no hook extra argument for this callback hook, so there is no need to check hook_extra
				//			$slug = static::parse_slug_from_relative_path( $hook_extra['plugin'] );

				// only continue logic operations if slug of plugin that is currently being on installation process is a subscribed one
				if ( static::is_subscribed( $slug ) ) {
					// get subscriber context of the addon currently in install process
					$active_sub = static::get_subscriber( $slug );

					if ( $active_sub !== null ) {
						$version = $active_sub->parse_version_from_package( $package );

						// return if version can not be parsed
						if ( $version === null ) {
							return $final_status;
						}

						// filter subscriber array to get all subscribers except the one currently target of the installation process
						$other_subs = array_filter( static::$subscribers, function ( $sub_id ) use ( $slug ) {
							return $sub_id !== $slug;

						}, ARRAY_FILTER_USE_KEY );

						$final_status = array_reduce( array_keys( $other_subs ),
							function ( $carry, $sub_id ) use ( $slug, $version, $other_subs ) {
								$sub_status = $other_subs[ $sub_id ]->version_sync_logic( $slug, $version );
								if ( is_wp_error( $sub_status ) ) {
									$carry = $sub_status;
								}

								return $carry;
							}, $final_status );

						// if collective final status is not an error, signal other subscribers to upgrade/downgrade/do nothing themselves
						if ( ! is_wp_error( $final_status ) ) {
							foreach ( $other_subs as $sub_id => $context ) {
								$context->install( $slug, $version );
							}
						}
					}
				}
			}
		}

		// set an admin notification for error display
		if ( is_wp_error( $final_status ) ) {
			static::set_admin_error_notice( $final_status->get_error_message() );
		}

		return $final_status;
	}

	/**
	 * Parse plugin slug from its relative path of entry file to plugin directory.
	 *
	 * @param string $relative_path relative path
	 *
	 * @return null|string slug or null if no slug found from path
	 */
	private static function parse_slug_from_relative_path( $relative_path ) {
		$match = [];
		preg_match( '/^.+\/(.+)\.php$/', $relative_path, $match );

		if ( isset( $match[1] ) ) {
			return $match[1];
		}

		return null;
	}

	/**
	 * Subscribe to version sync manager events.
	 *
	 * @param string $slug slug name
	 * @param Object $instance subscriber class instance
	 */
	public static function subscribe( $slug, $instance ) {
		if ( is_subclass_of( $instance,
				'\Ultimate_Blocks\includes\common\base\Version_Sync_Base' ) || is_subclass_of( $instance,
				'\Ultimate_Blocks_Pro\Inc\Common\Base\Version_Sync_Base' ) ) {
			static::$subscribers[ $slug ] = $instance;
		}
	}

	/**
	 * Show admin error messages at admin notice board.
	 */
	public static function show_error_message() {
		$error_message = get_transient( self::VERSION_SYNC_ERROR_TRANSIENT_KEY );

		if ( $error_message !== false ) {
			Admin_Notices_Manager::show_notice( $error_message, Admin_Notices_Manager::ERROR );
			delete_transient( self::VERSION_SYNC_ERROR_TRANSIENT_KEY );
		}
	}

	/**
	 * Set an admin error message.
	 *
	 * @param string $message message
	 */
	private static function set_admin_error_notice( $message ) {
		set_transient( self::VERSION_SYNC_ERROR_TRANSIENT_KEY, $message, self::HOUR_IN_SECONDS );
	}
}
