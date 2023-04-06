<?php

namespace Ultimate_Blocks\includes;

use Ultimate_Blocks\includes\common\traits\Manager_Base_Trait;
use Ultimate_Blocks\includes\common\factory\Rest_Response_Factory;
use Ultimate_Blocks\includes\pro_manager\Pro_Manager;
use WP_Error;
use WP_REST_Request;
use function add_action;
use function apply_filters;
use function current_user_can;
use function esc_html__;
use function register_rest_route;
use function rest_ensure_response;

// if called directly, abort process
if ( ! defined( 'WPINC' ) ) {
	die();
}

/**
 * Saved styles manager.
 */
class Saved_Styles_Manager {
	use Manager_Base_Trait;

	/**
	 * Rest route prefix.
	 * @var string
	 */
	const ROUTE_PREFIX = 'ultimate-blocks/v1';

	/**
	 * Rest api route directory for saved styles manager.
	 * @var string
	 */
	const ROUTE_DIR = 'saved-styles-base';

	/**
	 * Main process that will be called during initialization of manager.
	 *
	 * @return void
	 */
	protected function init_process() {
		$pro_status = Pro_Manager::get_instance()->is_pro();

		if ( ! $pro_status ) {
			add_action( 'rest_api_init', [
				$this,
				'register_rest_endpoints'
			] );// queue frontend data after related settings are registered since we will be using those on frontend data
			add_action( 'admin_init', [ $this, 'add_frontend_data' ] );// init hook
			add_action( 'init', [ $this, 'init_hook_callback' ] );
		}
	}

	/**
	 * Init callback hook for functionality depends on functions that are called on it.
	 * @return void
	 */
	public function init_hook_callback() {
		// initialize static styles manager
		Static_Styles_Manager::init();
	}

	/**
	 * Manager rest route.
	 * @return string rest route
	 */
	public final function rest_route() {
		return static::ROUTE_PREFIX . '/' . static::ROUTE_DIR;
	}

	/**
	 * Add frontend data related to saved styles.
	 */
	public function add_frontend_data() {
		$saved_styles_data = [
			'saved'   => $this->get_saved_styles(),
			'options' => [
				'restPath' => $this->rest_route()
			]
		];

		// ultimate-blocks/filter/savedStylesFrontendData filter hook
		$saved_styles_data = apply_filters( 'ultimate-blocks/filter/savedStylesFrontendData', $saved_styles_data );

		Editor_Data_Manager::get_instance()->add_editor_data( [ 'savedStyles' => $saved_styles_data ] );
	}

	/**
	 * Get/create saved styles from Options API.
	 *
	 * @param WP_REST_Request $request rest request instance
	 *
	 * @return string | WP_Error saved styles or error object
	 */
	public function saved_styles_rest( $request ) {
		$request_type = strtolower( $request->get_method() );

		switch ( $request_type ) {
			case 'get':
				$saved_styles = $this->get_saved_styles();

				return rest_ensure_response( Rest_Response_Factory::generate_response( $saved_styles ) );
			default:
				return Rest_Response_Factory::generate_response( null, 401, 'invalid_method',
					esc_html__( 'invalid request method' ) );
		}
	}

	/**
	 * Check current rest request permissions.
	 *
	 * @return bool | WP_Error permission check status
	 */
	public function rest_endpoint_permission_check() {
		if ( ! current_user_can( 'edit_posts' ) ) {
			return rest_ensure_response( Rest_Response_Factory::generate_rest_unauthorized() );
		}

		return true;
	}

	/**
	 * Get both user and plugin supplied saved styles.
	 *
	 * @final
	 * @return array saved styles object
	 */
	public final function get_saved_styles() {
		return [ 'styles' => null, 'defaultStyles' => null ];
	}

	/**
	 * Register manager related rest api endpoints and routes.
	 *
	 * @return void
	 */
	public function register_rest_endpoints() {
		register_rest_route( static::ROUTE_PREFIX, '/' . static::ROUTE_DIR, [
			'methods'             => 'GET',
			'callback'            => [ $this, 'saved_styles_rest' ],
			'permission_callback' => [ $this, 'rest_endpoint_permission_check' ],
		] );
	}
}
