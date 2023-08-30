<?php


namespace Ultimate_Blocks\includes\svg_sanitizer;

use Exception;

/**
 * Exception for DomDocument loadHtml operation failures
 */
class SvgSanitizeInvalidRootElement extends Exception {
	public function __construct( $message = 'Root element is not type of svg.', $code = 0, $previous = null ) {
		parent::__construct( $message, $code, $previous );
	}
}
