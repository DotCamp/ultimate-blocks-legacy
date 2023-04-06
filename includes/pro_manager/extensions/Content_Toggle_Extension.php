<?php

namespace Ultimate_Blocks\includes\pro_manager\extensions;

use Ultimate_Blocks\includes\pro_manager\base\Pro_Extension_Upsell;
use Ultimate_Blocks\includes\pro_manager\inc\Pro_Editor_Control_Data;

/**
 * Tabbed content block extension.
 */
class Content_Toggle_Extension extends Pro_Extension_Upsell {

	/**
	 * Use generate_upsell_data inside this function to generate your extension upsell data.
	 *
	 * Returned data array structure:
	 *
	 *  [
	 *      [ feature_id =>
	 *          [feature_name, feature_description, feature_screenshot(can be omitted for auto search)]
	 *      ],
	 *      ...
	 *  ]
	 *
	 *  Beside feature_id, remaining data should match arguments of `generate_upsell_data` method.
	 *
	 * @return array data
	 */
	public function add_upsell_data() {
		$base_data = [
			'search'         => [
				__( 'Content Search', 'ultimate-blocks' ),
				__( "Add a search bar feature that lets your users effortlessly search within your minimized content.",
					'ultimate-blocks' )
			],
			'searchSummary'  => [
				__( 'Search Summary', 'ultimate-blocks' ),
				__( "Determine the total number of search results for your users with just one glance.",
					'ultimate-blocks' )
			],
			'highlightColor' => [
				__( 'Highlight', 'ultimate-blocks' ),
				__( "Change the highlight color of search results to match your unique style.",
					'ultimate-blocks' )
			],
		];

		return Saved_Styles_Common::inject_upsell_data( $base_data );
	}

	/**
	 * Add data for editor sidebar upsell dummy controls.
	 *
	 * Override this function to actually send data, default is an empty array.
	 *
	 * @return array editor control data
	 */
	public function add_editor_dummy_control_data() {
		$search_panel_content = [
			Pro_Editor_Control_Data::generate_toggle_control_data( 'search',
				__( 'Enable content search', 'ultimate-blocks' ) ),

			Pro_Editor_Control_Data::generate_toggle_control_data( 'searchSummary',
				__( 'Show search summary', 'ultimate-blocks' ) ),
		];

		$style_panel_content = [
			Pro_Editor_Control_Data::generate_color_control_data( 'highlightColor', __( 'Search', 'ultimate-blocks' ), [
				Pro_Editor_Control_Data::generate_color_setting( __( 'Highlight', 'ultimate-blocks' ), '#FACC15' )
			] )
		];

		return [
			Pro_Editor_Control_Data::generate_panel_data( 'searchPanel', __( 'Search', 'ultimate-blocks' ),
				$search_panel_content ),
			Pro_Editor_Control_Data::generate_panel_data( 'stylePanel', __( 'Style', 'ultimate-blocks' ),
				$style_panel_content )
		];
	}
}
