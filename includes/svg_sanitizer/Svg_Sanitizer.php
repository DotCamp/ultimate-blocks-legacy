<?php

namespace Ultimate_Blocks\includes\svg_sanitizer;

use DOMDocument;
use DOMElement;

/**
 * Class for sanitizing svg elements.
 */
class Svg_Sanitizer {
	/**
	 * Raw svg html.
	 * @var string
	 */
	private $raw_svg_html;

	/**
	 * Allowed svg children tags.
	 * @var string[]
	 */
	private $allowed_tags = [ 'g', 'path' ];

	/**
	 * Class constructor.
	 */
	public function __construct( $svg_html ) {
		$this->raw_svg_html = $this->format_svg( $svg_html );
	}

	/**
	 * Sanitize svg.
	 *
	 * @return string sanitized svg
	 *
	 * @throws DomDocumentLoadHtmlException
	 * @throws SvgSanitizeInvalidRootElement
	 */
	public function sanitize() {
		$handler = $this->initiate_dom_document();

		if ( $handler ) {
			if ( $handler->documentElement->tagName === 'svg' ) {
				$to_be_removed_nodes = [];

				foreach ( $handler->documentElement->childNodes as $child_node ) {
					$this->check_svg_node( $child_node, $to_be_removed_nodes );
				}

				// remove invalid nodes from svg
				foreach ( $to_be_removed_nodes as $node_remove ) {
					$node_remove->parentNode->removeChild( $node_remove );
				}

				return $handler->saveHTML();
			} else {
				throw new SvgSanitizeInvalidRootElement();
			}
		} else {
			throw new DomDocumentLoadHtmlException();
		}
	}

	/**
	 * Check target svg node for possible not allowed tag types.
	 *
	 * @param DOMElement $target_node target node to check
	 * @param array $remove_list a list to add invalid nodes
	 *
	 * @return void
	 */
	private function check_svg_node( $target_node, &$remove_list ) {
		$target_node_type = $target_node->nodeName;
		if ( ! in_array( $target_node_type, $this->allowed_tags ) ) {
			$remove_list[] = $target_node;
		} else {
			$child_nodes = $target_node->childNodes;
			if ( sizeof( $child_nodes ) > 0 ) {
				foreach ( $child_nodes as $child_node ) {
					$this->check_svg_node( $child_node, $remove_list );
				}
			}
		}
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
	 *
	 * @return DOMDocument | false DomDocument object if successful, false if load process is failed
	 */
	private function initiate_dom_document() {
		$handler     = new DOMDocument();
		$load_status = @$handler->loadHTML( $this->raw_svg_html,
			LIBXML_NOWARNING | LIBXML_NOERROR | LIBXML_HTML_NODEFDTD | LIBXML_HTML_NOIMPLIED );

		if ( $load_status ) {
			return $handler;
		}

		return false;
	}
}
