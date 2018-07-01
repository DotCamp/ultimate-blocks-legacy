<?php
/**
 * Socialize your content with Social Share Block.
 *
 * @package SocialShareBlock
 */

/**
 * Include icons.
 */
require_once 'icons/icons.php';

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

	$icon_size  = $icon_sizes[ $attributes ['iconSize'] ];
	$icon_shape = $attributes['iconShape'];

	$facebook    = get_facebook_icon( $attributes, $icon_size, $icon_shape );
	$twitter     = get_twitter_icon( $attributes, $icon_size, $icon_shape );
	$linkedin    = get_linkedin_icon( $attributes, $icon_size, $icon_shape );
	$pinterest   = get_pinterest_icon( $attributes, $icon_size, $icon_shape );
	$reddit      = get_reddit_icon( $attributes, $icon_size, $icon_shape );
	$google_plus = get_googleplus_icon( $attributes, $icon_size, $icon_shape );
	$tumblr      = get_tumblr_icon( $attributes, $icon_size, $icon_shape );

	return '<div id="ub-social-share-block-editor" class="wp-block-ub-social-share">
		<div class="social-share-icons align-icons-' . $attributes['align'] . '">
			' . $facebook . '
			' . $twitter . '
			' . $linkedin . '
			' . $pinterest . '
			' . $reddit . '
			' . $google_plus . '
			' . $tumblr . '
		</div>
	</div>';
}

/**
 * Generate Facebook Icons.
 *
 * @param  array   $attributes Options of the block.
 * @param  integer $icon_size Size of Icon.
 * @param  string  $icon_shape Shape of Icon.
 * @return string
 */
function get_facebook_icon( $attributes, $icon_size, $icon_shape ) {
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
		u=' . rawurlencode( get_the_permalink() ) . '
		&title=' . get_the_title();

	return '<a
		target="_blank"
		href="' . $facebook_url . '"
		class="social-share-icon ' . $icon_shape . '"
		style="width:' . ( $icon_size * 1.5 ) . 'px;height:' . ( $icon_size * 1.5 ) . 'px;background-color:' . $attributes['facebookIconBgColor'] . '">
		' . $facebook_icon . '
	</a>';
}

/**
 * Generate Twitter Icon.
 *
 * @param  array   $attributes Options of the block.
 * @param  integer $icon_size Size of Icon.
 * @param  string  $icon_shape Shape of Icon.
 * @return string
 */
function get_twitter_icon( $attributes, $icon_size, $icon_shape ) {
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
		&url=' . rawurlencode( get_the_permalink() );

	return '<a
		target="_blank"
		href="' . $twitter_url . '"
		class="social-share-icon ' . $icon_shape . '"
		style="width:' . ( $icon_size * 1.5 ) . 'px;height:' . ( $icon_size * 1.5 ) . 'px;background-color:' . $attributes['twitterIconBgColor'] . '">
		' . $twitter_icon . '
	</a>';
}


/**
 * Generate Linked In Icon.
 *
 * @param  array   $attributes Options of the block.
 * @param  integer $icon_size Size of Icon.
 * @param  string  $icon_shape Shape of Icon.
 * @return string
 */
function get_linkedin_icon( $attributes, $icon_size, $icon_shape ) {
	if ( ! $attributes['showLinkedInIcon'] ) {
		return '';
	}

	// Generate the linked In Icon.
	$linkedin_icon = linkedin_icon(
		array(
			'width'     => $icon_size,
			'height'    => $icon_size,
			'fillColor' => $attributes['linkedInIconTextColor'],
		)
	);

	// Generate the Linked In URL.
	$linkedin_url = '
		https://www.linkedin.com/shareArticle?mini=true
		&url=' . rawurlencode( get_the_permalink() ) . '
		&title=' . get_the_title();

	return '<a
		target="_blank"
		href="' . $linkedin_url . '"
		class="social-share-icon ' . $icon_shape . '"
		style="width:' . ( $icon_size * 1.5 ) . 'px;height:' . ( $icon_size * 1.5 ) . 'px;background-color:' . $attributes['linkedInIconBgColor'] . '">
		' . $linkedin_icon . '
	</a>';
}


/**
 * Generate Pinterest Icon.
 *
 * @param  array   $attributes Options of the block.
 * @param  integer $icon_size Size of Icon.
 * @param  string  $icon_shape Shape of Icon.
 * @return string
 */
function get_pinterest_icon( $attributes, $icon_size, $icon_shape ) {
	global $post;

	if ( ! $attributes['showPinterestIcon'] ) {
		return '';
	}

	// Get the featured image.
	if ( has_post_thumbnail() ) {
		$thumbnail_id = get_post_thumbnail_id( $post->ID );
		$thumbnail    = $thumbnail_id ? current( wp_get_attachment_image_src( $thumbnail_id, 'large', true ) ) : '';
	} else {
		$thumbnail = null;
	}

	// Generate the Pinterest Icon.
	$pinterest_icon = pinterest_icon(
		array(
			'width'     => $icon_size,
			'height'    => $icon_size,
			'fillColor' => $attributes['pinterestIconTextColor'],
		)
	);

	// Generate the Pinterest URL.
	$pinterest_url = '
		https://pinterest.com/pin/create/button/?
		&url=' . rawurlencode( get_the_permalink() ) . '
		&description=' . get_the_title() . '
		&media=' . esc_url( $thumbnail );

	return '<a
		target="_blank"
		href="' . $pinterest_url . '"
		class="social-share-icon ' . $icon_shape . '"
		style="width:' . ( $icon_size * 1.5 ) . 'px;height:' . ( $icon_size * 1.5 ) . 'px;background-color:' . $attributes['pinterestIconBgColor'] . '">
		' . $pinterest_icon . '
	</a>';
}


/**
 * Generate Reddit Icon.
 *
 * @param  array   $attributes Options of the block.
 * @param  integer $icon_size Size of Icon.
 * @param  string  $icon_shape Shape of Icon.
 * @return string
 */
function get_reddit_icon( $attributes, $icon_size, $icon_shape ) {
	if ( ! $attributes['showRedditIcon'] ) {
		return '';
	}

	// Generate the Reddit Icon.
	$reddit_icon = reddit_icon(
		array(
			'width'     => $icon_size,
			'height'    => $icon_size,
			'fillColor' => $attributes['redditIconTextColor'],
		)
	);

	// Generate the Reddit URL.
	$reddit_url = '
		http://www.reddit.com/submit?
		url=' . rawurlencode( get_the_permalink() ) . '
		&title=' . get_the_title();

	return '<a
		target="_blank"
		href="' . $reddit_url . '"
		class="social-share-icon ' . $icon_shape . '"
		style="width:' . ( $icon_size * 1.5 ) . 'px;height:' . ( $icon_size * 1.5 ) . 'px;background-color:' . $attributes['redditIconBgColor'] . '">
		' . $reddit_icon . '
	</a>';
}


/**
 * Generate Google Plus Icon.
 *
 * @param  array   $attributes Options of the block.
 * @param  integer $icon_size Size of Icon.
 * @param  string  $icon_shape Shape of Icon.
 * @return string
 */
function get_googleplus_icon( $attributes, $icon_size, $icon_shape ) {
	if ( ! $attributes['showGooglePlusIcon'] ) {
		return '';
	}

	// Generate the Google Plus Icon.
	$googleplus_icon = googleplus_icon(
		array(
			'width'     => $icon_size,
			'height'    => $icon_size,
			'fillColor' => $attributes['googlePlusIconTextColor'],
		)
	);

	// Generate the Google Plus URL.
	$googleplus_url = '
		https://plus.google.com/share?
		url=' . rawurlencode( get_the_permalink() );

	return '<a
		target="_blank"
		href="' . $googleplus_url . '"
		class="social-share-icon ' . $icon_shape . '"
		style="width:' . ( $icon_size * 1.5 ) . 'px;height:' . ( $icon_size * 1.5 ) . 'px;background-color:' . $attributes['googlePlusIconBgColor'] . '">
		' . $googleplus_icon . '
	</a>';
}


/**
 * Generate Tumblr Icon.
 *
 * @param  array   $attributes Options of the block.
 * @param  integer $icon_size Size of Icon.
 * @param  string  $icon_shape Shape of Icon.
 * @return string
 */
function get_tumblr_icon( $attributes, $icon_size, $icon_shape ) {
	if ( ! $attributes['showTumblrIcon'] ) {
		return '';
	}

	// Generate the tumblr Icon.
	$tumblr_icon = tumblr_icon(
		array(
			'width'     => $icon_size,
			'height'    => $icon_size,
			'fillColor' => $attributes['tumblrIconTextColor'],
		)
	);

	// Generate the tumblr URL.
	$tumblr_url = '
		https://www.tumblr.com/widgets/share/tool?
		canonicalUrl=' . rawurlencode( get_the_permalink() ) . '
		&title=' . get_the_title();

	return '<a
		target="_blank"
		href="' . $tumblr_url . '"
		class="social-share-icon ' . $icon_shape . '"
		style="width:' . ( $icon_size * 1.5 ) . 'px;height:' . ( $icon_size * 1.5 ) . 'px;background-color:' . $attributes['tumblrIconBgColor'] . '">
		' . $tumblr_icon . '
	</a>';
}

/**
 * Register Block
 *
 * @return void
 */
function ub_register_block() {
	if( function_exists( 'register_block_type' ) ) {
		register_block_type( 'ub/social-share', array(
			'attributes'      => array(
				// Facebook.
				'facebookIconBgColor'     => array(
					'type'    => 'string',
					'default' => '#365899',
				),
				'facebookIconTextColor'   => array(
					'type'    => 'string',
					'default' => '#ffffff',
				),
				'showFacebookIcon'        => array(
					'type'    => 'boolean',
					'default' => true,
				),
				// Twitter.
				'twitterIconBgColor'      => array(
					'type'    => 'string',
					'default' => '#1da1f2',
				),
				'twitterIconTextColor'    => array(
					'type'    => 'string',
					'default' => '#ffffff',
				),
				'showTwitterIcon'         => array(
					'type'    => 'boolean',
					'default' => true,
				),
				// Linked In.
				'linkedInIconBgColor'     => array(
					'type'    => 'string',
					'default' => '#0073b1',
				),
				'linkedInIconTextColor'   => array(
					'type'    => 'string',
					'default' => '#ffffff',
				),
				'showLinkedInIcon'        => array(
					'type'    => 'boolean',
					'default' => true,
				),
				// Pinterest.
				'pinterestIconBgColor'    => array(
					'type'    => 'string',
					'default' => '#bd081c',
				),
				'pinterestIconTextColor'  => array(
					'type'    => 'string',
					'default' => '#ffffff',
				),
				'showPinterestIcon'       => array(
					'type'    => 'boolean',
					'default' => true,
				),
				// Reddit.
				'redditIconBgColor'       => array(
					'type'    => 'string',
					'default' => '#cee3f8',
				),
				'redditIconTextColor'     => array(
					'type'    => 'string',
					'default' => '#ffffff',
				),
				'showRedditIcon'          => array(
					'type'    => 'boolean',
					'default' => true,
				),
				// Google Plus.
				'googlePlusIconBgColor'   => array(
					'type'    => 'string',
					'default' => '#db4437',
				),
				'googlePlusIconTextColor' => array(
					'type'    => 'string',
					'default' => '#ffffff',
				),
				'showGooglePlusIcon'      => array(
					'type'    => 'boolean',
					'default' => true,
				),
				// Tumblr.
				'tumblrIconBgColor'       => array(
					'type'    => 'string',
					'default' => '#36465d',
				),
				'tumblrIconTextColor'     => array(
					'type'    => 'string',
					'default' => '#ffffff',
				),
				'showTumblrIcon'          => array(
					'type'    => 'boolean',
					'default' => true,
				),
				// Common.
				'iconSize'                => array(
					'type'    => 'string',
					'default' => 'normal',
				),
				'iconShape'               => array(
					'type'    => 'string',
					'default' => 'circle',
				),
				'align'                   => array(
					'type'    => 'string',
					'default' => 'left',
				),
			),
			'render_callback' => 'ub_render_block',
		) );
	}
}


add_action( 'init', 'ub_register_block' );
