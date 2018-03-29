<?php
/**
 * Click to tweet block.
 *
 * @package Social Share
 */

include_once 'icons/icons.php';

/**
 * Renders from server side.
 *
 * @param array $attributes The block attributes.
 */
function ub_render_block( $attributes ) {

	$icon_sizes = array(
		'normal' => 20,
		'medium' => 30,
		'large'  => 40,
	);

	$icon_size = $icon_sizes[ $attributes ['iconSize'] ];

	$facebook = get_facebook_icon( $attributes, $icon_size );
	$twitter  = get_twitter_icon( $attributes, $icon_size );

	return '<div id="ub-social-share-block-editor" class="wp-block-ub-social-share">
		<div class="social-share-icons align-icons-' . $attributes['align'] . '">
			' . $facebook . '
			' . $twitter . '
		</div>
	</div>';
}

/**
 * Generate Facebook Icons.
 *
 * @param  array   $attributes Options of the block.
 * @param  integer $icon_size Size of Icon.
 * @return string
 */
function get_facebook_icon( $attributes, $icon_size ) {
	if ( ! $attributes['showFacebookIcon'] ) {
		return '';
	}
	// Generate the Facebook Icon.
	$facebook_icon = facebook_icon(
		array(
			'width'     => $icon_size,
			'height'    => $icon_size,
			'fillColor' => $attributes['facebookIconTextColor'],
		)
	);
	// Generate the Facebook URL.
	$facebook_url = '
	https://www.facebook.com/sharer/sharer.php?
	u=' . get_the_permalink() . '
	&title=' . get_the_title() . '
	';

	return '<a
		href="' . $facebook_url . '"
		class="social-share-icon"
		style="width:' . ( $icon_size * 1.5 ) . 'px;height:' . ( $icon_size * 1.5 ) . 'px;background-color:' . $attributes['facebookIconBgColor'] . '">
		' . $facebook_icon . '
	</a>';
}


/**
 * Generate Twitter Icon.
 *
 * @param  array   $attributes Options of the block.
 * @param  integer $icon_size Size of Icon.
 * @return string
 */
function get_twitter_icon( $attributes, $icon_size ) {
	if ( ! $attributes['showTwitterIcon'] ) {
		return '';
	}
	// Generate the Twitter Icon.
	$twitter_icon = twitter_icon(
		array(
			'width'     => $icon_size,
			'height'    => $icon_size,
			'fillColor' => $attributes['twitterIconTextColor'],
		)
	);
	// Generate the Twitter URL.
	$twitter_url = '
	http://twitter.com/share?
	text=' . get_the_title() . '
	&url=' . get_the_permalink() . '
	';

	return '<a
		href="' . $twitter_url . '"
		class="social-share-icon"
		style="width:' . ( $icon_size * 1.5 ) . 'px;height:' . ( $icon_size * 1.5 ) . 'px;background-color:' . $attributes['twitterIconBgColor'] . '">
		' . $twitter_icon . '
	</a>';
}


/**
 * Register Block
 *
 * @return void
 */
function ub_register_block() {
	register_block_type( 'ub/social-share', array(
		'attributes'      => array(
			'twitter'         => array(
				'type'    => 'boolean',
				'default' => true,
			),
			'facebook'        => array(
				'type'    => 'boolean',
				'default' => true,
			),
			'facebookIconBgColor' => array (
				'type'    => 'string',
				'default' => '#0000ff',
			),
			'facebookIconTextColor' => array(
				'type'    => 'string',
				'default' => '#ffffff',
			),
			'showFacebookIcon' => array(
				'type'    => 'boolean',
				'default' => true,
			),
			'twitterIconBgColor' => array(
				'type'    => 'string',
				'default' => '#8ed1fc',
			),
			'twitterIconTextColor' => array(
				'type'    => 'string',
				'default' => '#ffffff',
			),
			'showTwitterIcon' => array(
				'type'    => 'boolean',
				'default' => true,
			),
			'iconSize'    => array(
				'type'    => 'string',
				'default' => 'normal',
			),
			'align' => array(
				'type'    => 'string',
				'default' => 'left',
			),
		),
		'render_callback' => 'ub_render_block',
	) );
}


add_action( 'init', 'ub_register_block' );
