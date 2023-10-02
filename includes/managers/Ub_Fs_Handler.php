<?php

namespace Ultimate_Blocks\includes\managers;

use WP_Filesystem_Base;
use function add_filter;
use function get_filesystem_method;
use function WP_Filesystem;

/**
 * Class to handle plugin filesystem operations.
 */
class Ub_Fs_Handler {
	const IDENTIFIER = 'ub_fs_handler';

	/**
	 * Add filter to filesystem method.
	 * @return void
	 */
	private static function add_filesystem_method_filter() {
		add_filter( 'filesystem_method', function ( $method, $filter_args ) {
			if ( ! empty( $filter_args['ub_fs_handler'] ) && $filter_args['ub_fs_handler'] === true ) {
				$method = 'direct';
			}

			return $method;
		}, 10, 2 );
	}

	/**
	 * Generate arguments for filesystem.
	 * @return array args
	 */
	private static function generate_args() {
		return [
			self::IDENTIFIER => true
		];
	}

	/**
	 * Get WordPress filesystem instance.
	 * @return WP_Filesystem_Base | false WP_Filesystem_Base object on success, false on failure
	 */
	public static function get_filesystem() {
		if ( ! function_exists( 'WP_Filesystem' ) ) {
			require_once( ABSPATH . 'wp-admin/includes/file.php' );
		}
		global $wp_filesystem;

		$status = $wp_filesystem;
		if ( get_filesystem_method() !== 'direct' ) {
			self::add_filesystem_method_filter();
			$status = WP_Filesystem( self::generate_args() );
		} else {
			if ( ! isset ( $wp_filesystem ) ) {
				$status = WP_Filesystem();
			}
		}

		return $status ? $wp_filesystem : false;
	}

	/**
	 * Call given callback with filesystem.
	 *
	 * @param array $callable callback
	 *
	 * @return mixed | void return value of callback
	 */
	public static function with_filesystem( $callable ) {
		if ( is_callable( $callable ) ) {
			$return_val = call_user_func( $callable, self::get_filesystem() );

			if ( ! function_exists( 'WP_Filesystem' ) ) {
				require_once( ABSPATH . 'wp-admin/includes/file.php' );
			}

			// reset filesystem
			WP_Filesystem();

			return $return_val;
		}
	}
}
