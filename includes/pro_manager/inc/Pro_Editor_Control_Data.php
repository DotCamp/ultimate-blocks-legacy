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
		'PANEL'        => 'panel',
		'TOGGLE'       => 'toggle',
		'SELECT'       => 'select',
		'COLOR'        => 'color',
		'ICON'         => 'icon',
		'BUTTON_GROUP' => 'button_group',
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
			'featureId' => $feature_id,
			'type'      => $control_type,
			'label'     => $title,
		];
	}

	/**
	 * Generate upsell button group dummy control data.
	 *
	 * @param string $feature_id feature id
	 * @param array $button_labels button labels
	 *
	 * @return array editor control data
	 */
	public static function generate_button_group_control_data( $feature_id, $button_labels ) {
		$base_data = static::generate_base_data( $feature_id, self::UB_PRO_EDITOR_CONTROL_TYPES['BUTTON_GROUP'], '__' );

		return array_merge( $base_data, [ 'buttonLabels' => $button_labels ] );
	}

	/**
	 * Generate upsell dummy control data.
	 *
	 * @param string $feature_id feature id
	 * @param string $title control title
	 *
	 * @return array editor control data
	 */
	public static function generate_color_control_data( $feature_id, $title, $color_settings ) {
		$base_data = static::generate_base_data( $feature_id, self::UB_PRO_EDITOR_CONTROL_TYPES['COLOR'], $title );

		return array_merge( $base_data, [ 'title' => $title, 'colorSettings' => $color_settings ] );
	}

	/**
	 * Generate color setting for color control data.
	 *
	 * @param string $label settings label
	 * @param string $color_value color value in hex
	 *
	 * @return array color setting
	 */
	public static function generate_color_setting( $label, $color_value ) {

		return [
			'label' => $label,
			'value' => $color_value
		];
	}

	/**
	 * Generate upsell icon dummy control data.
	 *
	 * @param string $feature_id feature id
	 * @param string $title control title
	 * @param string $icon_name icon name
	 *
	 * @return array editor control data
	 */
	public static function generate_icon_control_data( $feature_id, $title, $icon_name = 'star' ) {
		$base_data = static::generate_base_data( $feature_id, self::UB_PRO_EDITOR_CONTROL_TYPES['ICON'], $title );

		return array_merge( $base_data, [ 'selectedIcon' => $icon_name ] );
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

		$final_options = array_reduce( $options, function ( $carry, $current ) {
			$carry[] = [
				'label' => $current
			];

			return $carry;
		}, [] );

		return array_merge( $base_data, [ 'options' => $final_options ] );
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

		return array_merge( $base_data, [ 'contentData' => $content ] );
	}
}
