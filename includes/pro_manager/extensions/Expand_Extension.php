<?php

namespace Ultimate_Blocks\includes\pro_manager\extensions;

use Ultimate_Blocks\includes\pro_manager\base\Pro_Extension_Upsell;
use Ultimate_Blocks\includes\pro_manager\inc\Pro_Editor_Control_Data;

/**
 * Expand block extension.
 */
class Expand_Extension extends Pro_Extension_Upsell {

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
		return [
			'fade' => [
				__( 'Fade when minimized', 'ultimate-blocks' ),
				__( "Minimize and expand your content with a smooth, visually pleasing transition.",
					'ultimate-blocks' )
			],
			'buttonStyle' => [
				__( 'Button Style', 'ultimate-blocks' ),
				__( "Enhance user engagement and interaction by using a Button style.",
					'ultimate-blocks' )
			],
		];
	}

	/**
	 * Add data for editor sidebar upsell dummy controls.
	 *
	 * Override this function to actually send data, default is an empty array.
	 *
	 * @return array editor control data
	 */
	public function add_editor_dummy_control_data() {
		$panel_content = [
			Pro_Editor_Control_Data::generate_toggle_control_data( 'fade',
				__( 'Fade when minimized', 'ultimate-blocks' ) ),
		];
		$button_style_panel = [
			Pro_Editor_Control_Data::generate_button_group_control_data( 'buttonStyle',[
				__( 'Default', 'ultimate-blocks' ),
				__( 'Button', 'ultimate-blocks' ),
			] ),
		];

		return [
			Pro_Editor_Control_Data::generate_panel_data( 'scrollPanel', __( 'Scroll Settings', 'ultimate-blocks' ),
				$panel_content ),
			Pro_Editor_Control_Data::generate_panel_data( 'buttonStyle',
				__( 'Styles', 'ultimate-blocks' ),
				$button_style_panel )
		];
	}
}
