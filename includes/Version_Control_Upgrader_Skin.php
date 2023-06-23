<?php

namespace Ultimate_Blocks\includes;

use WP_Error;
use WP_Upgrader_Skin;

require_once( ABSPATH . '/wp-admin/includes/class-wp-upgrader-skin.php' );

// if called directly, abort process
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * Class Version_Control_Upgrader_Skin
 *
 * Upgrader skin for version rollback and version sync operations.
 */
class Version_Control_Upgrader_Skin extends WP_Upgrader_Skin {
	/**
	 * Errors array.
	 * @var array
	 */
	protected $errors = [];

	/**
	 * Plugin info.
	 * @var array
	 */
	public $plugin_info = [];

	/**
	 * Version_Control_Upgrader_Skin constructor.
	 *
	 * @param array $plugin_info
	 */
	public function __construct( $options, $plugin_info = [] ) {
		$this->plugin_info = $plugin_info;

		parent::__construct( $options );
	}


	/**
	 * @param string $string
	 * @param mixed ...$args Optional text replacements.
	 */
	public function feedback( $string, ...$args ) {
		// keep it quiet
	}

	/**
	 * @param string|WP_Error $errors
	 */
	public function error( $errors ) {
		if ( is_wp_error( $errors ) && $errors->has_errors() ) {
			foreach ( $errors->get_error_messages() as $error_message ) {
				$this->errors[] = $error_message;
			}
		}
	}

	/**
	 * Action to perform following an update.
	 *
	 * @since 2.8.0
	 */
	public function after() {
		if ( count( $this->errors ) > 0 ) {
			header( 'Content-Type: text/plain-text' );

			echo join( ',', $this->errors );
			die();
		}
	}

	/**
	 * Displays a form to the user to request for their FTP/SSH details in order
	 * to connect to the filesystem.
	 *
	 * @param bool|WP_Error $error Optional. Whether the current request has failed to connect,
	 *                                                    or an error object. Default false.
	 * @param string $context Optional. Full path to the directory that is tested
	 *                                                    for being writable. Default empty.
	 * @param bool $allow_relaxed_file_ownership Optional. Whether to allow Group/World writable. Default false.
	 *
	 * @return bool True on success, false on failure.
	 * @since 4.6.0 The `$context` parameter default changed from `false` to an empty string.
	 *
	 * @see request_filesystem_credentials()
	 *
	 * @since 2.8.0
	 */
	public function request_filesystem_credentials( $error = false, $context = '', $allow_relaxed_file_ownership = false ) {
		return true;
	}

	/**
	 */
	public function header() {
		// keep it quiet
	}

	/**
	 */
	public function footer() {
		// keep it quiet
	}
}
