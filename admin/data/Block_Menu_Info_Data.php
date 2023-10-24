<?php
/**
 * Info for blocks which will be used at settings menu.
 *
 * @package ultimate-blocks
 */

namespace Ultimate_Blocks\admin\data;

use Ultimate_Blocks\includes\common\interfaces\I_Plugin_Data;

/**
 * Info for blocks which will be used at settings menu.
 */
class Block_Menu_Info_Data implements I_Plugin_Data {

	/**
	 * Get data.
	 *
	 * @return mixed data
	 */
	public static function get_data() {
		return array(
			'ub/advanced-heading'        => array(
				esc_html__( 'Add headings with different typography settings.', 'ultimate-blocks' ),
			),
			'ub/advanced-video'          => array(
				esc_html__( 'Add or embed videos with more customizations.', 'ultimate-blocks' ),
			),
			'ub/button'                  => array(
				esc_html__( 'Add call-to-action buttons with advanced customizations.', 'ultimate-blocks' ),
			),
			'ub/call-to-action-block'    => array(
				esc_html__( 'Add conversion-optimized ‘Call to Action‘ boxes.', 'ultimate-blocks' ),
			),
			'ub/click-to-tweet'          => array(
				esc_html__( 'Add beautiful ‘Click to Tweet’ boxes with the username.', 'ultimate-blocks' ),
			),
			'ub/content-filter-block'    => array(
				esc_html__( 'Let your visitors filter the content based on different criteria.', 'ultimate-blocks' ),
			),
			'ub/content-toggle-block'    => array(
				esc_html__( 'Add content in accordions with FAQ Schema.', 'ultimate-blocks' ),
			),
			'ub/countdown'               => array(
				esc_html__( 'Add a beautiful countdown timer with time expiration.', 'ultimate-blocks' ),
			),
			'ub/divider'                 => array(
				esc_html__( 'Add dividers with different customizations.', 'ultimate-blocks' ),
			),
			'ub/expand'                  => array(
				esc_html__( 'Add ShowMore/Show Less or ReadMore/ReadLess option.', 'ultimate-blocks' ),
			),
			'ub/how-to'                  => array(
				esc_html__( 'Add HowTo Schema to your tutorial posts.', 'ultimate-blocks' ),
			),
			'ub/image-slider'            => array(
				esc_html__(
					'Add beautiful image sliders with different paginations and transitions.',
					'ultimate-blocks'
				),
			),
			'ub/post-grid'               => array(
				esc_html__( 'Show posts in a grid style with many customizations.', 'ultimate-blocks' ),
			),
			'ub/progress-bar'            => array(
				esc_html__( 'Add horizontal or circular progress bars with different criteria.', 'ultimate-blocks' ),
			),
			'ub/review'                  => array(
				esc_html__( 'Add schema-enabled review boxes.', 'ultimate-blocks' ),
			),
			'ub/social-share'            => array(
				esc_html__( 'Add social sharing icons or buttons to your posts/pages.', 'ultimate-blocks' ),
			),
			'ub/star-rating-block'       => array(
				esc_html__( 'Add simple star ratings with different numbers and colors.', 'ultimate-blocks' ),
			),
			'ub/styled-box'              => array(
				esc_html__(
					'Show your content in Notification Box, Feature Box, Number Box, and Bordered Box.',
					'ultimate-blocks'
				),
			),
			'ub/styled-list'             => array(
				esc_html__( 'Make your list stylish and beautiful with icons.', 'ultimate-blocks' ),
			),
			'ub/tabbed-content-block'    => array(
				esc_html__( 'Add content in tabs to save space on your site.', 'ultimate-blocks' ),
			),
			'ub/table-of-contents-block' => array(
				esc_html__( 'Generates a table of contents from the headings automatically.', 'ultimate-blocks' ),
			),
			'ub/testimonial'             => array(
				esc_html__( 'Add beautiful testimonials with the author\'s image.', 'ultimate-blocks' ),
			),
		);
	}
}
