<?php

namespace Ultimate_Blocks\includes\svg_sanitizer;

use Exception;

/**
 * Exception for DomDocument loadHtml operation failures
 */
class DomDocumentLoadHtmlException extends Exception {
	public function __construct( $message = 'DomDocument::loadHTML failed', $code = 0, $previous = null ) {
		parent::__construct( $message, $code, $previous );
	}
}
