<?php

namespace Ultimate_Blocks\includes\pro_manager\extensions;

use Ultimate_Blocks\includes\pro_manager\base\Pro_Extension_Upsell;
use Ultimate_Blocks\includes\pro_manager\inc\Pro_Editor_Control_Data;

/**
 * Image Slider block extension.
 */
class Review_Extension extends Pro_Extension_Upsell {

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
			'prosCons'            => [
				__( 'Pros/Cons', 'ultimate-blocks' ),
				__( "Include pros/cons tables for your users to make informed decisions by easily showcasing the advantages and disadvantages of any product or service.",
					'ultimate-blocks' )
			],
			'prosConsGraphLayout' => [
				__( 'Pros/Cons Graph Layout', 'ultimate-blocks' ),
				__( "Visually compare numeric values and make your users do data-driven decisions with ease.",
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
		$pros_cons_panel_layout_content = [
			Pro_Editor_Control_Data::generate_button_group_control_data( 'prosConsGraphLayout', [
				__( 'Basic', 'ultimate-blocks' ),
				__( 'Card', 'ultimate-blocks' ),
				__( 'Graph', 'ultimate-blocks' )
			] ),
		];

		$pros_cons_panel_content = [
			Pro_Editor_Control_Data::generate_toggle_control_data( 'prosCons',
				__( 'Enable Pros/Cons', 'ultimate-blocks' ) ),
			Pro_Editor_Control_Data::generate_panel_data( 'prosConsPanelLayout',
				__( 'Layouts', 'ultimate-blocks' ),
				$pros_cons_panel_layout_content ),
		];


		return [
			Pro_Editor_Control_Data::generate_panel_data( 'prosConsPanel', __( 'Pros/Cons', 'ultimate-blocks' ),
				$pros_cons_panel_content ),
		];
	}
}
