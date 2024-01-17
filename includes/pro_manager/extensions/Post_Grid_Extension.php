<?php

namespace Ultimate_Blocks\includes\pro_manager\extensions;

use Ultimate_Blocks\includes\pro_manager\base\Pro_Extension_Upsell;
use Ultimate_Blocks\includes\pro_manager\inc\Pro_Editor_Control_Data;

/**
 * Advanced Video  block extension.
 */
class Post_Grid_Extension extends Pro_Extension_Upsell {

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
			'postType'         => [
				__( 'Post Type', 'ultimate-blocks' ),
				__( 'Select Custom Post type.' )
			],
			'pagination'         => [
				__( 'Pagination', 'ultimate-blocks' ),
				__( 'Add pagination for the grid block.' )
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
		$post_type = [
			Pro_Editor_Control_Data::generate_select_control_data( 'postType',
				__( 'Post Type', 'ultimate-blocks' ) , 
				[ __( 'Post', 'ultimate-blocks' ), __( 'Page', 'ultimate-blocks' ) ]
                ),
		];
		$pagination = [
			Pro_Editor_Control_Data::generate_toggle_control_data( 'pagination',
				__( 'Pagination', 'ultimate-blocks' )
                ),
		];


		return [
			Pro_Editor_Control_Data::generate_panel_data( 'postType', __( 'Query', 'ultimate-blocks' ),
				$post_type ),
			Pro_Editor_Control_Data::generate_panel_data( 'pagination', __( 'Pagination', 'ultimate-blocks' ),
				$pagination ),
		];
	}
}
