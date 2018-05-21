<?php

/**
 * Fired during plugin activation
 *
 * @link       http://imtiazrayhan.com/
 * @since      1.0.2
 *
 * @package    ultimate_blocks
 * @subpackage ultimate_blocks/includes
 */

/**
 * Fired during plugin activation.
 *
 * This class defines all code necessary to run during the plugin's activation.
 *
 * @since      1.0.2
 * @package    ultimate_blocks
 * @subpackage ultimate_blocks/includes
 * @author     Imtiaz Rayhan <imtiazrayhan@gmail.com>
 */
class Ultimate_Blocks_Util {

	/**
	 * Get all Blocks.
	 *
	 * @since    1.0.2
	 * @return array
	 */
	public static function blocks() {

		return [
			array(
				'label'  => 'Button (Improved)',
				'name'   => 'ub/button-block',
				'active' => true,
			),
			array(
				'label'  => 'Call To Action',
				'name'   => 'ub/call-to-action',
				'active' => true,
			),
			array(
				'label'  => 'Click To Tweet',
				'name'   => 'ub/click-to-tweet',
				'active' => true,
			),
			array(
				'label'  => 'Content Toggle',
				'name'   => 'ub/content-toggle',
				'active' => true,
			),
			array(
				'label'  => 'Divider',
				'name'   => 'ub/divider',
				'active' => true,
			),
			array(
				'label'  => 'Feature Box',
				'name'   => 'ub/feature-box',
				'active' => true,
			),
			array(
				'label'  => 'Notification Box',
				'name'   => 'ub/notification-box',
				'active' => true,
			),
			array(
				'label'  => 'Number Box',
				'name'   => 'ub/number-box',
				'active' => true,
			),
			array(
				'label'  => 'Social Share',
				'name'   => 'ub/social-share',
				'active' => true,
			),
			array(
				'label'  => 'Testimonial',
				'name'   => 'ub/testimonial-block',
				'active' => true,
			),
			array(
				'label'  => 'Tabbed Content',
				'name'   => 'ub/tabbed-content',
				'active' => true,
			),
		];
	}

}
