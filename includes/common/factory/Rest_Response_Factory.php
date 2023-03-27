<?php

namespace Ultimate_Blocks\includes\common\factory;

use WP_Error;
use WP_REST_Response;
use function esc_html__;

// if called directly, abort process
if ( ! defined( 'WPINC' ) ) {
	die();
}

/**
 * Factory for creating REST/HTTP responses.
 */
class Rest_Response_Factory {

	/**
	 * Create data property for response object.
	 *
	 * @param int $status status code
	 * @param mixed $response response data
	 *
	 * @return array data property
	 */
	private static function create_data_property( $status, $response = null ) {
		return [
			"status"   => $status,
			"response" => $response
		];
	}

	/**
	 * Generate rest response.
	 *
	 * @param mixed $response_data data to sent
	 * @param int $status status
	 * @param string $code status code
	 * @param string $message response message
	 *
	 * @return WP_REST_Response | WP_Error response
	 */
	public static function generate_response( $response_data, $status = 200, $code = 'OK', $message = null ) {
		if ( is_null( $message ) ) {
			$message = esc_html__( 'no message provided', 'ultimate-blocks-pro' );
		}

		if ( $status < 400 ) {
			return new WP_REST_Response( [
				"code"    => $code,
				"message" => $message,
				"data"    => static::create_data_property( $status, $response_data )
			] );
		} else {
			return new WP_Error( $code, $message, static::create_data_property( $status, $response_data ) );
		}
	}

	/**
	 * Generate generic unauthorized rest response.
	 *
	 * @return WP_Error wp error object
	 */
	public static final function generate_rest_unauthorized() {
		return static::generate_response( null, 401, 'rest_forbidden',
			esc_html__( 'you are not authorized to use this REST endpoint' ) );
	}
}
