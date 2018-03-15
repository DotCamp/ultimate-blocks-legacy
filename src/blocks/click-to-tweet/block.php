<?php
/**
 * Click to tweet block.
 */
function ub_register_meta() {
	register_meta( 'post', 'ub_ctt_tweet', array(
		'show_in_rest' => true,
		'single' => true
	) );
}

add_action( 'init', 'ub_register_meta' );

function render_block( $attributes ) {
	// Tweet.
	$tweet      = get_post_meta( get_the_ID(), 'ub_ctt_tweet', true );
	$tweet_url  = ( $tweet ) ? rawurlencode( $tweet ) : false;
	$tweet_text = ( $tweet ) ? $tweet : false;

	$tweetFontSize = is_array( $attributes ) && isset( $attributes['tweetFontSize'] ) ? "font-size:{$attributes['tweetFontSize']}" : "font-size: 20";

	$permalink = esc_url( get_the_permalink() );
	$url       = apply_filters( 'gutenkit_click_to_tweet_url', "http://twitter.com/share?&text={$tweet_url}&url={$permalink}" );

	$output = '';
	$output .= '<div class="ub_click_to_tweet">';
	$output .= '<div class="ub_tweet" style="'. $tweetFontSize .'px">';
	$output .= $tweet;
	$output .= '</div>';
	$output .= '<div class="ub_click_tweet">';
	$output .= '<span style="display: inline-flex">';
	$output .= '<i></i>';
	$output .= sprintf( '<a target="_blank" href="%1$s">Click to Tweet</a>', esc_url( $url ) );
	$output .= '</span>';
	$output .= '</div>';
	$output .= '</div>';

	return $output;
}

function register_block() {
	register_block_type( 'ub/click-to-tweet', array(
		'render_callback' => 'render_block',
	) );
}

add_action('init', 'register_block');