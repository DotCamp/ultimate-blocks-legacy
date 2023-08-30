<?php

namespace Ultimate_Blocks\__tests__\php\unit\includes\svg_sanitizer;

use PHPUnit\Framework\Attributes\RequiresPhpExtension;
use Ultimate_Blocks\__tests__\php\test_bases\TestBase;
use Ultimate_Blocks\includes\svg_sanitizer\Svg_Sanitizer;
use Ultimate_Blocks\includes\svg_sanitizer\SvgSanitizeInvalidRootElement;

/**
 * Svg_Sanitizer class tests.
 */
#[RequiresPhpExtension( 'xml' )]
class Svg_SanitizerTest extends TestBase {

	public function testRawSvgFormat() {
		$space_removal = '   ';
		$sanitizer     = new Svg_Sanitizer( '' );

		$space_removal_result = $this->invoke_private_method( $sanitizer, 'format_svg', [ $space_removal ] );
		$this->assertEquals( 1, strlen( $space_removal_result ) );

		$new_line_removal        = "this is a test\nwith multiple carriage returns inside\r";
		$new_line_removal_result = $this->invoke_private_method( $sanitizer, 'format_svg', [ $new_line_removal ] );

		$pattern = '/[\r\n]/';
		// pattern check
		$this->assertMatchesRegularExpression( $pattern, $new_line_removal );

		$this->assertDoesNotMatchRegularExpression( $pattern, $new_line_removal_result );
	}

	public function testRootElementInvalidException() {
		$sanitizer = new Svg_Sanitizer( '<div />' );

		$this->expectException( SvgSanitizeInvalidRootElement::class );
		$sanitizer->sanitize();
	}

	public function testInvalidTagAtRootLevel() {
		$svg_html      = <<<SVG_TEST_HTML
<svg>
	<g>
    </g>
    <text>
	</text>
</svg>
SVG_TEST_HTML;
		$sanitizer     = new Svg_Sanitizer( $svg_html );
		$sanitized_svg = $sanitizer->sanitize();

		$this->assertDoesNotMatchRegularExpression( '/<text>/', $sanitized_svg );
	}

	public function testInvalidTagAtChildren() {
		$svg_html      = <<<SVG_TEST_HTML
<svg>
	<g>
		<path>
			<text></text>
		</path>
    </g>
</svg>
SVG_TEST_HTML;
		$sanitizer     = new Svg_Sanitizer( $svg_html );
		$sanitized_svg = $sanitizer->sanitize();

		$this->assertDoesNotMatchRegularExpression( '/<text>/', $sanitized_svg );
		$this->assertMatchesRegularExpression( '/<path>/', $sanitized_svg );
	}
}
