<?php

namespace Ultimate_Blocks\includes\pro_manager\extensions;

use Ultimate_Blocks\includes\pro_manager\base\Pro_Extension_Upsell;
use Ultimate_Blocks\includes\pro_manager\inc\Pro_Editor_Control_Data;

/**
 * Button block extension.
 */
class Button_Extension extends Pro_Extension_Upsell {

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
			'transitionAnimation' => [
				__( 'Transition Animation', 'ultimate-blocks' ),
				__( 'Add hover animation feature and increase engagement by adding visual cues that entice users to click on your call-to-action buttons.',
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
		$colors_panel_content = [
			Pro_Editor_Control_Data::generate_select_control_data( 'transitionAnimation',
				__( 'Transition animation', 'ultimate-blocks' ),
				[ __( 'Fade', 'ultimate-blocks' ), __( 'Wipe', 'ultimate-blocks' ) ] )
		];

		return [
			Pro_Editor_Control_Data::generate_panel_data( 'colorsPanel', __( 'Colors', 'ultimate-blocks' ),
				$colors_panel_content )
		];
	}
}
