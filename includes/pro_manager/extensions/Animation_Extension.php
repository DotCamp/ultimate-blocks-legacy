<?php

namespace Ultimate_Blocks\includes\pro_manager\extensions;

use Ultimate_Blocks\includes\pro_manager\base\Pro_Extension_Upsell;
use Ultimate_Blocks\includes\pro_manager\inc\Pro_Editor_Control_Data;

/**
 * Visibility Control extension.
 */
class Animation_Extension extends Pro_Extension_Upsell {

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
			'animation' => [
				__( 'Animation', 'ultimate-blocks' ),
				__( 'Use animations on your blocks to make them even more engaging.',
					'ultimate-blocks' )
			]
		];

		// add saved styles upsell data too
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
		$animation_data = [
			Pro_Editor_Control_Data::generate_select_control_data( 'animation',
				__( 'Repeat', 'ultimate-blocks' ),
				[ __( 'Fade', 'ultimate-blocks' ), __( 'Bounce', 'ultimate-blocks' ), __( 'Slid', 'ultimate-blocks' )] ),
		];

		return [
			Pro_Editor_Control_Data::generate_panel_data( 'animation', __( 'Animation', 'ultimate-blocks' ), $animation_data )
		];
	}
}
