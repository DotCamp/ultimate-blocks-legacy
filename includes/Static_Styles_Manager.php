<?php

namespace Ultimate_Blocks\includes;

use Ultimate_Blocks\includes\common\factory\Rest_Response_Factory;
use Ultimate_Blocks\includes\common\traits\Manager_Base_Trait;
use WP_Error;
use WP_Filesystem_Base;
use WP_REST_Request;
use function add_action;
use function add_filter;
use function check_ajax_referer;
use function current_user_can;
use function register_rest_route;
use function request_filesystem_credentials;
use function site_url;
use function trailingslashit;
use function esc_html__;
use function path_join;
use function rest_ensure_response;
use function WP_Filesystem;
use function wp_create_nonce;

// if called directly, abort process
if ( ! defined( 'WPINC' ) ) {
	die();
}

/**
 * Manager responsible for static saved styles served to end users.
 * These styles are the ones supplied by plugin by default.
 */
class Static_Styles_Manager {
	use Manager_Base_Trait;

	/**
	 * Static style path related to plugin folder root.
	 * @var string
	 */
	private $static_data_path = 'admin/data/savedStyles.ubdata';

	/**
	 * Rest api route directory for saved styles manager.
	 * @var string
	 */
	private $static_route_dir = 'static';

	/**
	 * Main process that will be called during initialization of manager.
	 *
	 * @return void
	 */
	protected function init_process() {
		if ( current_user_can( 'administrator' ) ) {
			add_filter( 'ultimate-blocks/filter/savedStylesFrontendData', [ $this, 'add_frontend_data' ] );
			add_action( 'rest_api_init', [ $this, 'register_rest_endpoints' ] );
		}

		add_filter( 'ultimate-blocks/filter/savedStylesFrontendData', [ $this, 'add_static_styles' ] );
	}

	/**
	 * Add static styles to frontend.
	 *
	 * @param array $saved_styles_data saved styles data
	 *
	 * @return array saved styles data
	 */
	public function add_static_styles( $saved_styles_data ) {
		$raw_saved_styles_data = $saved_styles_data['saved']['styles'];

		// check for any static style saved to user styles
		$filtered_saved_styles_data = $this->filter_static_styles( $raw_saved_styles_data );

		$saved_styles_data['saved']['styles'] = $this->inject_static_styles( $filtered_saved_styles_data );

		return $saved_styles_data;
	}

	/**
	 * Filter static styles from saved styles.
	 * @return string filtered and encoded saved styles
	 */
	public function filter_static_styles( $saved_styles ) {
		$static_styles         = $this->read_static_saved_styles();
		$decoded_static_styles = [];

		if ( ! is_null( $static_styles ) ) {
			$decoded_static_styles = json_decode( base64_decode( $static_styles ), true );
		}

		$decoded_saved_styles = is_null( $saved_styles ) ? null : json_decode( base64_decode( $saved_styles ), true );

		$final_styles = [];
		if ( ! is_null( $decoded_saved_styles ) ) {
			foreach ( $decoded_saved_styles as $block => $block_styles ) {
				if ( isset( $decoded_static_styles[ $block ] ) ) {
					foreach ( $block_styles as $style_id => $style_content ) {
						if ( ! key_exists( $style_id, $decoded_static_styles[ $block ] ) ) {
							if ( ! isset( $final_styles[ $block ] ) ) {
								$final_styles[ $block ] = [];
							}
							$final_styles[ $block ][ $style_id ] = $style_content;
						}
					}
				} else {
					$final_styles[ $block ] = $block_styles;
				}
			}
		}

		return base64_encode( json_encode( $final_styles ) );
	}

	/**
	 * Register REST endpoints.
	 * @return void
	 */
	public function register_rest_endpoints() {
		register_rest_route( Saved_Styles_Manager::ROUTE_PREFIX,
			Saved_Styles_Manager::ROUTE_DIR . '/' . $this->static_route_dir, [
				'methods'             => 'POST',
				'callback'            => [ $this, 'handle_static_style_save' ],
				'permission_callback' => [ $this, 'static_style_write_rest_permission_check' ],
				'args'                => $this->static_rest_args()
			] );

		register_rest_route( Saved_Styles_Manager::ROUTE_PREFIX,
			Saved_Styles_Manager::ROUTE_DIR . '/' . $this->static_route_dir . '/delete', [
				'methods'             => 'POST',
				'callback'            => [ $this, 'handle_static_style_delete' ],
				'permission_callback' => [ $this, 'static_style_write_rest_permission_check' ],
				'args'                => $this->static_rest_delete_args()
			] );
	}

	/**
	 * Static style delete REST route arguments.
	 * @return array arguments
	 */
	private function static_rest_delete_args() {
		return [
			'styleId'   => [
				'description'       => esc_html__( 'static style id to be removed' ),
				'type'              => 'string',
				'required'          => true,
				'sanitize_callback' => 'sanitize_text_field',
				'validate_callback' => [ $this, 'validate_static_rest_args' ],
			],
			'blockType' =>
				[
					'description'       => esc_html__( 'block type', 'ultimate-blocks-pro' ),
					'type'              => 'string',
					'required'          => true,
					'validate_callback' => [ $this, 'validate_static_rest_args' ],
					'sanitize_callback' => 'sanitize_text_field'
				]
		];
	}

	/**
	 * Delete a static style.
	 *
	 * @param WP_REST_Request $request request object
	 *
	 * @return WP_Error/WP_Rest_Response response object
	 */
	public function handle_static_style_delete( $request ) {
		$block_type = $request->get_param( 'blockType' );
		$style_id   = $request->get_param( 'styleId' );

		$static_styles = $this->decode_static_styles();

		if ( isset( $static_styles[ $block_type ] ) && isset( $static_styles[ $block_type ][ $style_id ] ) ) {
			unset( $static_styles[ $block_type ][ $style_id ] );

			$write_status = $this->write_to_static_styles( $this->encode_static_styles( $static_styles ) );

			if ( $write_status ) {
				return rest_ensure_response( Rest_Response_Factory::generate_response( null, 200, 'OK',
					esc_html__( 'static style removed' ) ) );
			} else {
				return rest_ensure_response( Rest_Response_Factory::generate_response( null, 401, 'write_failure',
					esc_html__( 'static style remove operation failed' ) ) );
			}
		} else {
			return rest_ensure_response( Rest_Response_Factory::generate_response( null, 401, 'delete_operation_failed',
				esc_html__( 'no valid block type/style found with the given arguments' ) ) );
		}
	}

	/**
	 * Decoded static styles.
	 * @return array decoded static styles
	 */
	private function decode_static_styles() {
		$current_static_styles = $this->read_static_saved_styles();

		if ( is_null( $current_static_styles ) ) {
			$current_static_styles = base64_encode( json_encode( [] ) );
		}

		return json_decode( base64_decode( $current_static_styles ), true );
	}

	/**
	 * Encode given static styles object.
	 *
	 * @param null|array $static_styles static styles
	 *
	 * @return string encoded static styles
	 */
	private function encode_static_styles( $static_styles ) {
		if ( is_null( $static_styles ) ) {
			$static_styles = [];
		}

		return base64_encode( json_encode( $static_styles ) );
	}

	/**
	 * Write to static styles file.
	 *
	 * @param string $encoded_static_styles base64 and json encoded static style
	 *
	 * @return bool write operation result
	 */
	public function write_to_static_styles( $encoded_static_styles ) {

		$file_access_credentials = request_filesystem_credentials( site_url() . '/wp-admin/', '', true, false );

		if ( $this->native_filesystem_setup( $file_access_credentials ) ) {
			/**
			 * Filesystem base instance.
			 *
			 * @global
			 * @var WP_Filesystem_Base
			 */
			global $wp_filesystem;

			$file_path = path_join( ULTIMATE_BLOCKS_PATH, $this->static_data_path );

			if ( $wp_filesystem->exists( $file_path ) && $wp_filesystem->is_file( $file_path ) ) {
				return $wp_filesystem->put_contents( $file_path, $encoded_static_styles );
			}
		}

		return false;
	}

	/**
	 * Handle static style save operation.
	 *
	 * @param WP_REST_Request $request rest request
	 *
	 * @return WP_Error/WP_Rest_Response rest response
	 */
	public function handle_static_style_save( $request ) {

		$decoded_static_styles = $this->decode_static_styles();

		$block_type   = $request->get_param( 'blockType' );
		$style_id     = $request->get_param( 'styleId' );
		$style_object = $request->get_param( 'styles' );
		$style_title  = $request->get_param( 'title' );

		if ( ! isset( $decoded_static_styles[ $block_type ] ) ) {
			$decoded_static_styles[ $block_type ] = [];
		}

		$decoded_static_styles[ $block_type ][ $style_id ] = [
			'title'  => $style_title,
			'styles' => json_decode( base64_decode( $style_object ), true )
		];

		$encoded_static_styles = $this->encode_static_styles( $decoded_static_styles );
		$write_status          = $this->write_to_static_styles( $encoded_static_styles );

		if ( $write_status ) {
			return rest_ensure_response( Rest_Response_Factory::generate_response( null, 200, 'OK',
				esc_html__( 'static style saved' ) ) );
		} else {
			return rest_ensure_response( Rest_Response_Factory::generate_response( null, 401, 'write_failure',
				esc_html__( 'static style save operation failed' ) ) );
		}
	}

	/**
	 * Arguments for static rest endpoint.
	 * @return array void defined arguments for static rest endpoint
	 */
	public function static_rest_args() {
		$args = [];

		$args['title'] = [
			'description'       => esc_html__( 'static style name', 'ultimate-blocks-pro' ),
			'type'              => 'string',
			'required'          => true,
			'validate_callback' => [ $this, 'validate_static_rest_args' ],
			'sanitize_callback' => 'sanitize_text_field'
		];

		$args['styleId'] = [
			'description'       => esc_html__( 'static style id', 'ultimate-blocks-pro' ),
			'type'              => 'string',
			'required'          => true,
			'validate_callback' => [ $this, 'validate_static_rest_args' ],
			'sanitize_callback' => 'sanitize_text_field'
		];

		$args['styles'] = [
			'description'       => esc_html__( 'static style values', 'ultimate-blocks-pro' ),
			'type'              => 'string',
			'required'          => true,
			'validate_callback' => [ $this, 'validate_static_rest_args' ],
			'sanitize_callback' => 'sanitize_text_field'
		];

		$args['blockType'] = [
			'description'       => esc_html__( 'block type', 'ultimate-blocks-pro' ),
			'type'              => 'string',
			'required'          => true,
			'validate_callback' => [ $this, 'validate_static_rest_args' ],
			'sanitize_callback' => 'sanitize_text_field'
		];

		return $args;
	}

	/**
	 * Validate render route parameters.
	 *
	 * @param mixed $value value
	 * @param WP_REST_Request $request request object
	 * @param string $param parameter key
	 *
	 * @return WP_Error|boolean validation result
	 */
	public function validate_static_rest_args( $value, $request, $param ) {
		switch ( $param ) {
			case 'title' :
			case 'blockType':
				return true;
			case 'styleId':
				return strpos( $value, 'ub-dev' ) === 0;
			case 'styles' :
				$asciiDecoded = base64_decode( $value );

				@json_decode( $asciiDecoded );

				if ( json_last_error() !== JSON_ERROR_NONE ) {
					return Rest_Response_Factory::generate_response( null, 401, 'invalid_property',
						esc_html__( 'invalid property supplied' ) );
				}

				return true;
		}

		return rest_ensure_response( Rest_Response_Factory::generate_response( null, 401, 'invalid_parameters',
			esc_html__( 'invalid parameters supplied for request' ) ) );
	}

	/**
	 * Permission check for REST static style write operations.
	 *
	 * @param WP_REST_Request $request request object
	 *
	 * @return bool/WP_Error permission check status
	 */
	public function static_style_write_rest_permission_check( $request ) {
		if ( current_user_can( 'administrator' ) && check_ajax_referer( $this->static_rest_route(), 'nonce', false ) ) {
			return true;
		}

		return rest_ensure_response( Rest_Response_Factory::generate_rest_unauthorized() );
	}

	/**
	 * Add frontend data.
	 *
	 * @param array $saved_styles_data saved styles frontend data
	 *
	 * @return array filtered frontend data
	 */
	public function add_frontend_data( $saved_styles_data ) {
		if ( current_user_can( 'administrator' ) ) {
			$static_style_frontend_data = [
				'staticWriteNonce'      => wp_create_nonce( $this->static_rest_route() ),
				'staticWriteRestRoute'  => $this->static_rest_route(),
				'staticDeleteRestRoute' => $this->static_rest_route() . '/delete',
			];

			$saved_styles_data['options'] = array_merge( $saved_styles_data['options'], $static_style_frontend_data );
		}

		$raw_saved_styles_data                = $saved_styles_data['saved']['styles'];
		$saved_styles_data['saved']['styles'] = $this->inject_static_styles( $raw_saved_styles_data );

		return $saved_styles_data;
	}

	/**
	 * Inject static styles to frontend user ones.
	 *
	 * @param null | string $user_saved_styles user saved styles encoded string
	 *
	 * @return string encoded saved styles
	 */
	private function inject_static_styles( $user_saved_styles ) {
		$encoded_static_styles = $this->read_static_saved_styles();

		if ( ! is_null( $encoded_static_styles ) ) {
			$decoded_static_styles = json_decode( base64_decode( $encoded_static_styles ), true );

			$decoded_user_styles = [];

			if ( ! is_null( $user_saved_styles ) ) {
				$decoded_user_styles = json_decode( base64_decode( $user_saved_styles ), true );
			}

			$final_styles = array_merge_recursive( $decoded_user_styles, $decoded_static_styles );

			$user_saved_styles = base64_encode( json_encode( $final_styles ) );
		}

		return $user_saved_styles;
	}

	/**
	 * Static style rest route.
	 * @return string rest route
	 */
	private function static_rest_route() {
		return trailingslashit( Saved_Styles_Manager::get_instance()->rest_route() ) . $this->static_route_dir;
	}

	/**
	 * Setup filesystem.
	 *
	 * @param bool $file_access_credentials filesystem credentials
	 *
	 * @return bool setup status
	 */
	private function native_filesystem_setup( $file_access_credentials = null ) {
		if ( ! function_exists( 'WP_Filesystem' ) ) {
			include trailingslashit( ABSPATH ) . 'wp-admin/includes/file.php';
		}

		return WP_Filesystem( $file_access_credentials ? $file_access_credentials : true );
	}

	/**
	 * Read saved styles supplied by plugin by default.
	 *
	 * @private
	 * @return string | null default saved styles
	 */
	private function read_static_saved_styles() {
		if ( ! $this->native_filesystem_setup( true ) ) {
			return null;
		}

		/**
		 * Filesystem object.
		 *
		 * @global
		 * @var WP_Filesystem_Base
		 */
		global $wp_filesystem;

		$file_path = path_join( ULTIMATE_BLOCKS_PATH, $this->static_data_path );

		if ( $wp_filesystem->exists( $file_path ) && $wp_filesystem->is_file( $file_path ) && $wp_filesystem->is_readable( $file_path ) ) {
			$content = $wp_filesystem->get_contents( $file_path );
			if ( ! empty( $content ) ) {
				return $content;
			}
		}

		return null;
	}
}
