<?php
/**
 * Click to tweet block.
 */

/**
 * Registering meta for the tweet.
 */
function ub_register_meta() {
	register_meta( 'post', 'ub_ctt_via', array(
		'show_in_rest' => true,
		'single' => true
	) );
}

add_action( 'init', 'ub_register_meta' );

/**
 * Rendering the block dynamically.
 *
 * @param $attributes
 *
 * @return string
 *
 */
function ub_render_click_to_tweet_block( $attributes ) {

	$via = get_post_meta( get_the_ID(), 'ub_ctt_via', true );
	$via = ( $via ) ? '&via=' . str_replace( '@', '', $via ) : false;
    $tweet = preg_replace('/<br><br>$/', '<br>', $attributes['ubTweet']);
	$tweet_url  = ( $tweet ) ? rawurlencode( preg_replace('/<.+?>/', '', str_replace("<br>","\n",$tweet) )) : false;

	$tweetFontSize = isset( $attributes['tweetFontSize'] ) ? "font-size:{$attributes['tweetFontSize']}" : "font-size: 20";
	$tweetColor = isset( $attributes['tweetColor'] ) ? "color:{$attributes['tweetColor']}" : "color: #444444";
	$borderColor = isset( $attributes['borderColor'] ) ? "border-color:{$attributes['borderColor']}" : "border-color: #CCCCCC";

	$permalink = esc_url( get_the_permalink() );
	$url       = apply_filters( 'ub_click_to_tweet_url', "http://twitter.com/intent/tweet?&text={$tweet_url}&url={$permalink}{$via}" );

	$output = '';
	$output .= sprintf('<div class="ub_click_to_tweet" style="%1$s">', esc_attr( $borderColor ));
    $output .= sprintf( '<div class="ub_tweet" style="%1$spx; %2$s">', esc_attr( $tweetFontSize ), esc_attr( $tweetColor ) );
    $output .= $tweet;
	$output .= sprintf('</div>');
	$output .= sprintf( '<div class="ub_click_tweet">' );
	$output .= sprintf( '<span style="display: inline-flex">');
	$output .= sprintf( '<i></i>');
	$output .= sprintf( '<a target="_blank" href="%1$s">' . __( 'Click to Tweet', 'ultimate-blocks' ) . '</a>',  $url  );
	$output .= sprintf( '</span>');
	$output .= sprintf( '</div>');
    $output .= sprintf( '</div>');

	return $output;
}

/**
 * Registering dynamic block.
 */
function ub_register_click_to_tweet_block() {
	if ( function_exists( 'register_block_type' ) ) {
		register_block_type( 'ub/click-to-tweet', array(
            'attributes' => array(
                'ubTweet' => array(
                    'type' => 'string',
                    'default' => ''
                ),
                'tweetFontSize' => array(
                    'type' => 'number',
                    'default' => 20
                ),
                'tweetColor' => array(
                    'type' => 'string',
                    'default' => '#444444'
                ),
                'borderColor' => array(
                    'type' => 'string',
                    'default' => '#CCCCCC'
                ),
            ),
			'render_callback' => 'ub_render_click_to_tweet_block'));
	}
}

add_action('init', 'ub_register_click_to_tweet_block');
