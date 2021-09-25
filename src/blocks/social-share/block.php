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
    $additionalStyle =  ' style="width:' . ( $icon_size * 1.5 ) . 'px;height:' . ( $icon_size * 1.5 ) . 'px;"';

	$iconDetails = array(
		'facebook' => ub_get_facebook_icon( $attributes, $icon_size, $iconShape, $useCaptions ? $facebookCaption : '', $addOutline && $useCaptions ),
		'twitter' => ub_get_twitter_icon( $attributes, $icon_size, $iconShape, $useCaptions ? $twitterCaption : '', $addOutline && $useCaptions ),
		'linkedin' => ub_get_linkedin_icon( $attributes, $icon_size, $iconShape, $useCaptions ? $linkedInCaption : '', $addOutline && $useCaptions ),
		'pinterest' => ub_get_pinterest_icon( $attributes, $icon_size, $iconShape, $useCaptions ? $pinterestCaption : '', $addOutline && $useCaptions ),
		'reddit' => ub_get_reddit_icon( $attributes, $icon_size, $iconShape, $useCaptions ? $redditCaption : '', $addOutline && $useCaptions ),
		'tumblr' => ub_get_tumblr_icon( $attributes, $icon_size, $iconShape, $useCaptions ? $tumblrCaption : '', $addOutline && $useCaptions)
	);

	$icons = '';

	foreach($iconOrder as $icon){
		$icons .= $iconDetails[$icon];
	}

	if($blockID === ''){
		$icons = str_replace('"><svg', '"' . $additionalStyle . '><svg', $icons);
	}

    return '<div class="wp-block-ub-social-share'.(isset($className) ? ' ' . esc_attr($className) : '').
                '"' . ($blockID === '' ? '' : ' id="ub-social-share-' . $blockID . '"') . '>
		<div class="social-share-icons align-icons-' . $align . ($useCaptions && !$addOutline ? ' no-outline' : '') . '">' . $icons .
        '</div>
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

function ub_prepare_social_share_icon($icon, $iconShape, $siteName, $link, $caption, $hasOutline){
	if($hasOutline){
		return '<a target="_blank" href="' . esc_url($link) . '" class="ub-social-share-' . $siteName . '-container">
		<span class="social-share-icon ub-social-share-' . $siteName . ' ' . $iconShape . '">' .
		   $icon .
		'</span>' .
		( $caption ? ('<span>' . $caption . '</span>') : '' ) . '</a>';
	}
	else{
		return ($caption ? ('<div class="ub-social-share-' . $siteName . '-container">') : '') .
		'<a target="_blank" href="' . esc_url($link) . '" class="social-share-icon ub-social-share-' . $siteName . ' ' . ($caption ? ' ' : 'ub-social-share-standalone-icon ') . $iconShape . '">'
        	. $icon . '</a>' . 
		( $caption ? '<span><a target="_blank" href="' . esc_url($link) . '">' . $caption . '</a></span></div>' : '' );
	}
}

function ub_get_facebook_icon( $attributes, $icon_size, $iconShape, $caption, $hasOutline ) {
    extract($attributes);
	if ( !$showFacebookIcon ) {
		return '';
	}

	// Generate the Facebook Icon.
	$facebook_icon = facebook_icon(
		array(
			'width'     => $icon_size,
			'height'    => $icon_size,
			'color'		=> $iconShape === 'none' ? ($buttonColor ?: '#1877f2') : ''
		)
	);

	// Generate the Facebook URL.
    $facebook_url = 'https://www.facebook.com/sharer/sharer.php?u='
        . rawurlencode( get_the_permalink() ) . '&title=' . get_the_title();

	return ub_prepare_social_share_icon($facebook_icon, $iconShape, 'facebook', $facebook_url, $caption, $hasOutline);
}

/**
 * Generate Twitter Icon.
 *
 * @param  array   $attributes Options of the block.
 * @param  integer $icon_size Size of Icon.
 * @param  string  $iconShape Shape of Icon.
 * @return string
 */
function ub_get_twitter_icon( $attributes, $icon_size, $iconShape, $caption, $hasOutline ) {
    extract($attributes);
	if ( !$showTwitterIcon ) {
		return '';
	}

	// Generate the Twitter Icon.
	$twitter_icon = twitter_icon(
		array(
			'width'     => $icon_size,
			'height'    => $icon_size,
			'color'		=> $iconShape === 'none' ? ($buttonColor ?: '#1d9BF0' ): ''
		)
	);

	// Generate the Twitter URL.
    $twitter_url = 'http://twitter.com/intent/tweet?url=' . rawurlencode( get_the_permalink() ) . '&text=' . get_the_title();

	return ub_prepare_social_share_icon($twitter_icon, $iconShape, 'twitter', $twitter_url, $caption, $hasOutline);
}


/**
 * Generate Linked In Icon.
 *
 * @param  array   $attributes Options of the block.
 * @param  integer $icon_size Size of Icon.
 * @param  string  $iconShape Shape of Icon.
 * @return string
 */
function ub_get_linkedin_icon( $attributes, $icon_size, $iconShape, $caption, $hasOutline ) {
    extract($attributes);
	if ( ! $showLinkedInIcon ) {
		return '';
	}

	// Generate the linked In Icon.
	$linkedin_icon = linkedin_icon(
		array(
			'width'     => $icon_size,
			'height'    => $icon_size,
			'color'		=> $iconShape === 'none' ? ( $buttonColor ?: '#2867b2' ) : ''
		)
	);

	// Generate the Linked In URL.
	$linkedin_url = 'https://www.linkedin.com/sharing/share-offsite/?url=' . rawurlencode( get_the_permalink() );

	return ub_prepare_social_share_icon($linkedin_icon, $iconShape, 'linkedin', $linkedin_url, $caption, $hasOutline);
}


/**
 * Generate Pinterest Icon.
 *
 * @param  array   $attributes Options of the block.
 * @param  integer $icon_size Size of Icon.
 * @param  string  $iconShape Shape of Icon.
 * @return string
 */
function ub_get_pinterest_icon( $attributes, $icon_size, $iconShape, $caption, $hasOutline ) {
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
			'height'    => $icon_size,
			'color'		=> $iconShape === 'none' ? ( $buttonColor ?: '#e60023' ) : ''
		)
	);

	// Generate the Pinterest URL.
    $pinterest_url = 'https://pinterest.com/pin/create/button/?&url='
        . rawurlencode( get_the_permalink() )
        . '&description=' . get_the_title()
        . '&media=' . $thumbnail;

	return ub_prepare_social_share_icon($pinterest_icon, $iconShape, 'pinterest', $pinterest_url, $caption, $hasOutline);
}


/**
 * Generate Reddit Icon.
 *
 * @param  array   $attributes Options of the block.
 * @param  integer $icon_size Size of Icon.
 * @param  string  $iconShape Shape of Icon.
 * @return string
 */
function ub_get_reddit_icon( $attributes, $icon_size, $iconShape, $caption, $hasOutline ) {
    extract($attributes);
	if ( ! $showRedditIcon ) {
		return '';
	}

	// Generate the Reddit Icon.
	$reddit_icon = reddit_icon(
		array(
			'width'     => $icon_size,
			'height'    => $icon_size,
			'color'		=> $iconShape === 'none' ? ($buttonColor ?: '#ff4500') : ''
		)
	);

	// Generate the Reddit URL.
    $reddit_url = 'http://www.reddit.com/submit?url='
        . rawurlencode( get_the_permalink() ) .
        '&title=' . get_the_title();

	return ub_prepare_social_share_icon($reddit_icon, $iconShape, 'reddit', $reddit_url, $caption, $hasOutline);
}


/**
 * Generate Tumblr Icon.
 *
 * @param  array   $attributes Options of the block.
 * @param  integer $icon_size Size of Icon.
 * @param  string  $iconShape Shape of Icon.
 * @return string
 */
function ub_get_tumblr_icon( $attributes, $icon_size, $iconShape, $caption, $hasOutline ) {
    extract($attributes);
	if ( ! $showTumblrIcon ) {
		return '';
	}

	// Generate the tumblr Icon.
	$tumblr_icon = tumblr_icon(
		array(
			'width'     => $icon_size,
			'height'    => $icon_size,
			'color'		=> $iconShape === 'none' ? ( $buttonColor ?: '#001935' ) : ''
		)
	);

	// Generate the tumblr URL.
    $tumblr_url = 'https://www.tumblr.com/widgets/share/tool?canonicalUrl='
        . rawurlencode( get_the_permalink() )
		. '&title=' . get_the_title();

	return ub_prepare_social_share_icon($tumblr_icon, $iconShape, 'tumblr', $tumblr_url, $caption, $hasOutline);
}

/**
 * Register Block
 *
 * @return void
 */
function ub_register_social_share_block() {
	if( function_exists( 'register_block_type' ) ) {
        require dirname(dirname(__DIR__)) . '/defaults.php';
		register_block_type( 'ub/social-share', array(
			'attributes'      => $defaultValues['ub/social-share']['attributes'],
			'render_callback' => 'ub_render_social_share_block',
		) );
	}
}


add_action( 'init', 'ub_register_social_share_block' );
