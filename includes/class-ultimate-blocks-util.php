<?php
/**
 * Block utilities.
 *
 * @package ultimate-blocks
 */

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
	 * @return array
	 * @since    1.0.2
	 */
	public static function blocks() {

		return array(
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
			),
			array(
				'label'  => 'Icon',
				'name'   => 'ub/icon',
				'active' => true,
			),
			array(
				'label'  => 'Counter',
				'name'   => 'ub/counter',
				'active' => true,
			),
		);
	}
	/**
	 * Get all Extensions.
	 *
	 * @return array
	 * @since    3.0.9
	 */
	public static function extensions(){
		return array(
			array(
				'label'  => 'Responsive Control',
				'name'   => 'responsive-control',
				'active' => true,
				'icon'   => '<svg fill="#E11B4C" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false"><path d="M20.5 16h-.7V8c0-1.1-.9-2-2-2H6.2c-1.1 0-2 .9-2 2v8h-.7c-.8 0-1.5.7-1.5 1.5h20c0-.8-.7-1.5-1.5-1.5zM5.7 8c0-.3.2-.5.5-.5h11.6c.3 0 .5.2.5.5v7.6H5.7V8z"></path></svg>'
			),
		);
	}
}
