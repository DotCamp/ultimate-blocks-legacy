<?php

namespace Ultimate_Blocks\includes\common\traits;

use function rest_authorization_required_code;

/**
 * Trait Ajax_Response
 *
 * PHP trait for ajax responses
 *
 */
trait Ajax_Response_Trait {
	/**
	 * Response data.
	 *
	 * @var array
	 */
	private $response_data = [];

	/**
	 * Set message for ajax response
	 *
	 * @param string $message message to be sent
	 */
	public function set_message( $message ) {
		http_response_code( 200 );
		$this->response_data['message'] = $message;
	}

	/**
	 * Set error message for ajax response
	 *
	 * @param string $error error message to be sent
	 */
	public function set_error( $error ) {
		http_response_code( rest_authorization_required_code() );
		$this->response_data['error'] = $error;
	}

	/**
	 * Send response data as a json format
	 *
	 * @param bool $die close connection after sending data
	 */
	public function send_json( $die = true ) {
		header( 'Content-Type: application/json' );
		echo json_encode( $this->response_data );
		$this->reset_data();

		if ( $die ) {
			die();
		}
	}

	/**
	 * Reset ajax data.
	 */
	private function reset_data() {
		$this->response_data = [];
	}

	/**
	 * Append data to given key.
	 *
	 * @param mixed  $data  value
	 * @param string $key data key
	 */
	public function append_response_data( $data, $key ) {
		if ( ! isset( $this->response_data['data'] ) ) {
			$this->response_data['data'] = [];
		}

		$this->response_data['data'] = [ $key => $data ];
	}
}
