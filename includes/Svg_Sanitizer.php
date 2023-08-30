<?php

namespace Ultimate_Blocks\includes;

use DOMDocument;

/**
 * Class for sanitizing svg elements.
 */
class Svg_Sanitizer {
	/**
	 * Raw svg html.
	 * @var string
	 */
	private $raw_svg_html = '';

	/**
	 * Class constructor.
	 */
	public function __construct( $svg_html ) {
		$this->raw_svg_html = $this->format_svg( $svg_html );
	}

	/**
	 * Format given raw svg string and strip impurities.
	 *
	 * @param string $html_string target html string
	 *
	 * @return string cleaned up svg string
	 */
	private function format_svg( $html_string ) {
		return preg_replace( '/\s+/', ' ', str_replace( [ "\r", "\n" ], '', $html_string ) );
	}

	/**
	 * Startup DomDocument handler.
	 * @return void
	 */
	private function initiate_dom_document() {
		$handler = new DOMDocument();
	}
}
