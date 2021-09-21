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
				'label'  => 'Advanced Heading',
				'name'   => 'ub/advanced-heading',
				'active' => true,
			),
			array(
				'label'  => 'Advanced Video',
				'name'   => 'ub/advanced-video',
				'active' => true,
			),
			array(
				'label'  => 'Button (Improved)',
				'name'   => 'ub/button',
				'active' => true,
			),
			array(
				'label'  => 'Call To Action',
				'name'   => 'ub/call-to-action-block',
				'active' => true,
			),
			array(
				'label'  => 'Click To Tweet',
				'name'   => 'ub/click-to-tweet',
				'active' => true,
            ),
            array(
				'label'  => 'Content Filter',
				'name'   => 'ub/content-filter-block',
				'active' => true,
            ),
			array(
				'label'  => 'Content Toggle',
				'name'   => 'ub/content-toggle-block',
				'active' => true,
            ),
            array(
                'label'  => 'Countdown',
                'name'   => 'ub/countdown',
                'active' => true,
            ),
			array(
				'label'  => 'Divider',
				'name'   => 'ub/divider',
				'active' => true,
            ),
            array(
				'label'  => 'Expand',
				'name'   => 'ub/expand',
				'active' => true,
			),
			array(
				'label'  => 'How To',
				'name'   => 'ub/how-to',
				'active' => true,
			),
            array(
                'label'  => 'Image Slider',
                'name'   => 'ub/image-slider',
                'active' => true,
            ),
            array(
                'label'  => 'Post Grid',
                'name'   => 'ub/post-grid',
                'active' => true,
            ),
            array(
				'label'  => 'Progress Bar',
				'name'   => 'ub/progress-bar',
				'active' => true,
            ),
            array(
                'label'  => 'Review',
                'name'   => 'ub/review',
                'active' => true,
            ),
			array(
				'label'  => 'Social Share',
				'name'   => 'ub/social-share',
				'active' => true,
            ),
            array(
				'label'  => 'Star Rating',
				'name'   => 'ub/star-rating-block',
				'active' => true,
            ),
            array(
				'label'  => 'Styled Box',
				'name'   => 'ub/styled-box',
				'active' => true,
			),
            array(
				'label'  => 'Styled List',
				'name'   => 'ub/styled-list',
				'active' => true,
			),
			array(
				'label'  => 'Tabbed Content',
				'name'   => 'ub/tabbed-content-block',
				'active' => true,
            ),
			array(
				'label'  => 'Table of Contents',
				'name'   => 'ub/table-of-contents-block',
				'active' => true,
            ),
            array(
				'label'  => 'Testimonial',
				'name'   => 'ub/testimonial',
				'active' => true,
			)
		];
	}

}
