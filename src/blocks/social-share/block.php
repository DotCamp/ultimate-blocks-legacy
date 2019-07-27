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
function ub_render_social_share_block( $attributes ) {
    extract($attributes);
	$icon_sizes = array(
		'normal' => 20,
		'medium' => 30,
		'large'  => 40,
	);

	$icon_size  = $icon_sizes[ $iconSize ];

	$facebook    = ub_get_facebook_icon( $attributes, $icon_size, $iconShape );
	$twitter     = ub_get_twitter_icon( $attributes, $icon_size, $iconShape );
	$linkedin    = ub_get_linkedin_icon( $attributes, $icon_size, $iconShape );
	$pinterest   = ub_get_pinterest_icon( $attributes, $icon_size, $iconShape );
	$reddit      = ub_get_reddit_icon( $attributes, $icon_size, $iconShape );
	$google_plus = ub_get_googleplus_icon( $attributes, $icon_size, $iconShape );
	$tumblr      = ub_get_tumblr_icon( $attributes, $icon_size, $iconShape );

	return '<div class="wp-block-ub-social-share '.esc_attr($className).'">
		<div class="social-share-icons align-icons-' . $align . '">
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
 * @param  string  $iconShape Shape of Icon.
 * @return string
 */
function ub_get_facebook_icon( $attributes, $icon_size, $iconShape ) {
    extract($attributes);
	if ( !$showFacebookIcon ) {
		return '';
	}

	// Generate the Facebook Icon.
	$facebook_icon = facebook_icon(
		array(
			'width'     => $icon_size,
			'height'    => $icon_size
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
		class="social-share-icon ' . $iconShape . '"
		style="width:' . ( $icon_size * 1.5 ) . 'px;height:' . ( $icon_size * 1.5 ) . 'px;background-color: #365899;">
		' . $facebook_icon . '
	</a>';
}

/**
 * Generate Twitter Icon.
 *
 * @param  array   $attributes Options of the block.
 * @param  integer $icon_size Size of Icon.
 * @param  string  $iconShape Shape of Icon.
 * @return string
 */
function ub_get_twitter_icon( $attributes, $icon_size, $iconShape ) {
    extract($attributes);
	if ( !$showTwitterIcon ) {
		return '';
	}

	// Generate the Twitter Icon.
	$twitter_icon = twitter_icon(
		array(
			'width'     => $icon_size,
			'height'    => $icon_size
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
		class="social-share-icon ' . $iconShape . '"
		style="width:' . ( $icon_size * 1.5 ) . 'px;height:' . ( $icon_size * 1.5 ) . 'px;background-color: #1da1f2;">
		' . $twitter_icon . '
	</a>';
}


/**
 * Generate Linked In Icon.
 *
 * @param  array   $attributes Options of the block.
 * @param  integer $icon_size Size of Icon.
 * @param  string  $iconShape Shape of Icon.
 * @return string
 */
function ub_get_linkedin_icon( $attributes, $icon_size, $iconShape ) {
    extract($attributes);
	if ( ! $showLinkedInIcon ) {
		return '';
	}

	// Generate the linked In Icon.
	$linkedin_icon = linkedin_icon(
		array(
			'width'     => $icon_size,
			'height'    => $icon_size
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
		class="social-share-icon ' . $iconShape . '"
		style="width:' . ( $icon_size * 1.5 ) . 'px;height:' . ( $icon_size * 1.5 ) . 'px;background-color: #0073b1;">
		' . $linkedin_icon . '
	</a>';
}


/**
 * Generate Pinterest Icon.
 *
 * @param  array   $attributes Options of the block.
 * @param  integer $icon_size Size of Icon.
 * @param  string  $iconShape Shape of Icon.
 * @return string
 */
function ub_get_pinterest_icon( $attributes, $icon_size, $iconShape ) {
	global $post;
    extract($attributes);
	if ( ! $showPinterestIcon ) {
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
			'height'    => $icon_size
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
		class="social-share-icon ' . $iconShape . '"
		style="width:' . ( $icon_size * 1.5 ) . 'px;height:' . ( $icon_size * 1.5 ) . 'px;background-color: #bd081c;">
		' . $pinterest_icon . '
	</a>';
}


/**
 * Generate Reddit Icon.
 *
 * @param  array   $attributes Options of the block.
 * @param  integer $icon_size Size of Icon.
 * @param  string  $iconShape Shape of Icon.
 * @return string
 */
function ub_get_reddit_icon( $attributes, $icon_size, $iconShape ) {
    extract($attributes);
	if ( ! $showRedditIcon ) {
		return '';
	}

	// Generate the Reddit Icon.
	$reddit_icon = reddit_icon(
		array(
			'width'     => $icon_size,
			'height'    => $icon_size
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
		class="social-share-icon ' . $iconShape . '"
		style="width:' . ( $icon_size * 1.5 ) . 'px;height:' . ( $icon_size * 1.5 ) . 'px;background-color: #cee3f8;">
		' . $reddit_icon . '
	</a>';
}


/**
 * Generate Google Plus Icon.
 *
 * @param  array   $attributes Options of the block.
 * @param  integer $icon_size Size of Icon.
 * @param  string  $iconShape Shape of Icon.
 * @return string
 */
function ub_get_googleplus_icon( $attributes, $icon_size, $iconShape ) {
    extract($attributes);
	if ( ! $showGooglePlusIcon ) {
		return '';
	}

	// Generate the Google Plus Icon.
	$googleplus_icon = googleplus_icon(
		array(
			'width'     => $icon_size,
			'height'    => $icon_size
		)
	);

	// Generate the Google Plus URL.
	$googleplus_url = '
		https://plus.google.com/share?
		url=' . rawurlencode( get_the_permalink() );

	return '<a
		target="_blank"
		href="' . $googleplus_url . '"
		class="social-share-icon ' . $iconShape . '"
		style="width:' . ( $icon_size * 1.5 ) . 'px;height:' . ( $icon_size * 1.5 ) . 'px;background-color: #db4437;">
		' . $googleplus_icon . '
	</a>';
}


/**
 * Generate Tumblr Icon.
 *
 * @param  array   $attributes Options of the block.
 * @param  integer $icon_size Size of Icon.
 * @param  string  $iconShape Shape of Icon.
 * @return string
 */
function ub_get_tumblr_icon( $attributes, $icon_size, $iconShape ) {
    extract($attributes);
	if ( ! $showTumblrIcon ) {
		return '';
	}

	// Generate the tumblr Icon.
	$tumblr_icon = tumblr_icon(
		array(
			'width'     => $icon_size,
			'height'    => $icon_size
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
		class="social-share-icon ' . $iconShape . '"
		style="width:' . ( $icon_size * 1.5 ) . 'px;height:' . ( $icon_size * 1.5 ) . 'px;background-color: #36465d;">
		' . $tumblr_icon . '
	</a>';
}

/**
 * Register Block
 *
 * @return void
 */
function ub_register_social_share_block() {
	if( function_exists( 'register_block_type' ) ) {
		register_block_type( 'ub/social-share', array(
			'attributes'      => array(
                'blockID'=>array(
                    'type' => 'string',
                    'default' => ''
                ),
				'showFacebookIcon'        => array(
					'type'    => 'boolean',
					'default' => true,
				),
				'showTwitterIcon'         => array(
					'type'    => 'boolean',
					'default' => true,
				),
				'showLinkedInIcon'        => array(
					'type'    => 'boolean',
					'default' => true,
				),
				'showPinterestIcon'       => array(
					'type'    => 'boolean',
					'default' => true,
				),
				'showRedditIcon'          => array(
					'type'    => 'boolean',
					'default' => true,
				),
				'showGooglePlusIcon'      => array(
					'type'    => 'boolean',
					'default' => true,
				),
				'showTumblrIcon'          => array(
					'type'    => 'boolean',
					'default' => true,
				),
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
			'render_callback' => 'ub_render_social_share_block',
		) );
	}
}


add_action( 'init', 'ub_register_social_share_block' );
