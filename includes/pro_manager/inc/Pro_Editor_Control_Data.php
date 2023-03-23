<?php

namespace Ultimate_Blocks\includes\pro_manager\inc;

/**
 * Editor sidebar control data generator.
 */
class Pro_Editor_Control_Data {

	/**
	 * Editor control types.
	 */
	const UB_PRO_EDITOR_CONTROL_TYPES = [
		'PANEL'  => 'panel',
		'TOGGLE' => 'toggle',
		'SELECT' => 'select',
	];

	/**
	 * Generate base data.
	 *
	 * @param string $feature_id feature id
	 * @param string $control_type control type
	 * @param string $title title
	 *
	 * @return array base data
	 */
	public static function generate_base_data( $feature_id, $control_type, $title ) {

		return [
			'id'    => $feature_id,
			'type'  => $control_type,
			'title' => $title,
		];
	}

	/**
	 * Generate upsell dummy control data.
	 *
	 * @param string $feature_id feature id
	 * @param string $title control title
	 *
	 * @return array editor control data
	 */
	public static function generate_toggle_control_data( $feature_id, $title, $help = '' ) {
		$base_data = static::generate_base_data( $feature_id, self::UB_PRO_EDITOR_CONTROL_TYPES['TOGGLE'], $title );

		return array_merge( $base_data, [ 'help' => $help ] );
	}

	/**
	 * Generate upsell dummy control data.
	 *
	 * @param string $feature_id feature id
	 * @param string $title control title
	 * @param array $options options to select
	 *
	 * @return array editor control data
	 */
	public static function generate_select_control_data( $feature_id, $title, $options ) {
		$base_data = static::generate_base_data( $feature_id, self::UB_PRO_EDITOR_CONTROL_TYPES['SELECT'], $title );

		return array_merge( $base_data, [ 'options' => $options ] );
	}

	/**
	 * Generate upsell dummy control data.
	 *
	 * @param string $feature_id feature id
	 * @param string $title control title
	 * @param array $content panel children control data
	 *
	 * @return array editor control data
	 */
	public static function generate_panel_data( $feature_id, $title, $content ) {
		$base_data = static::generate_base_data( $feature_id, self::UB_PRO_EDITOR_CONTROL_TYPES['PANEL'], $title );

		return array_merge( $base_data, [ 'content' => $content ] );
	}
}
