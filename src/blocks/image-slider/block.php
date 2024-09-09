<?php

function ub_get_image_slider_styles( $attributes ) {
	$navigation_color = isset($attributes['navigationColor']) ? $attributes['navigationColor'] : '';
	$pagination_color = isset($attributes['paginationColor']) ? $attributes['paginationColor'] : '';
	$active_pagination_color = isset($attributes['activePaginationColor']) ? $attributes['activePaginationColor'] : '';

	$styles = array(
		'--swiper-navigation-color'				=> $navigation_color,
		'--swiper-pagination-color'				=> $active_pagination_color,
		'--swiper-inactive-pagination-color'	=> $pagination_color,
		'--swiper-navigation-background-color'	=> Ultimate_Blocks\includes\get_background_color_var($attributes, 'navigationBackgroundColor', 'navigationGradientColor')
	);

	return Ultimate_Blocks\includes\generate_css_string( $styles );
}

/**
 * Enqueue frontend script for content toggle block
 *
 * @return void
 */

function ub_render_image_slider_block($attributes){
    extract($attributes);

    $imageArray = isset($pics) ? (count($pics) > 0 ? $pics : json_decode($images, true)) : array();
    $captionArray = isset($descriptions) ? count($descriptions) > 0 ? $descriptions : json_decode($captions, true) : array();

    $gallery = '';

    foreach($imageArray as $key => $image){
        $gallery .= '<figure class="swiper-slide">
        <img src="' . esc_url($image['url']) . '" alt="' . esc_attr($image['alt']) . '"' .
            ($blockID === '' ? ' style="height: ' . esc_attr($sliderHeight) . 'px;"' : '') . '>' .
            '<figcaption class="ub_image_slider_image_caption">' . ($captionArray[$key]['link'] === '' ? '' : '<a href="' . esc_url($captionArray[$key]['link']) . '">')
            . wp_kses_post($captionArray[$key]['text'])
            . ($captionArray[$key]['link'] === '' ? '' : '</a>') . ' </figcaption></figure>';
    }
    $classes = array( 'ub_image_slider', 'swiper-container' );
    if( !empty($align) ){
        $classes[] = 'align' . esc_attr($align) ;
    }

	$styles = ub_get_image_slider_styles($attributes);
    $wrapper_attributes = get_block_wrapper_attributes(
        array(
            'class' => implode(' ', $classes),
			'style' => $styles
        )
    );
    return '<div ' . $wrapper_attributes .  ' ' . ($blockID === '' ? 'style="min-height: ' . (25 + (count($imageArray) > 0) ? esc_attr($sliderHeight) : 200) . 'px;"'
        : 'id="ub_image_slider_' . esc_attr($blockID) . '"').
        ' data-swiper-data=\'{"speed":' . esc_attr($speed) . ',"spaceBetween":' . esc_attr($spaceBetween) . ',"slidesPerView":' . esc_attr($slidesPerView) . ',"loop":' . json_encode($wrapsAround) .
            ',"pagination":{"el": ' . ($usePagination ? '".swiper-pagination"' : 'null') . ' , "type": "' . esc_attr($paginationType) . '"'.($paginationType === 'bullets' ? ', "clickable":true' :'') . '}
            ,' . ($useNavigation ? '"navigation": {"nextEl": ".swiper-button-next", "prevEl": ".swiper-button-prev"},' : '') . ' "keyboard": { "enabled": true },
            "effect": "' . esc_attr($transition) . '"'
            . ($transition === 'fade' ? ',"fadeEffect":{"crossFade": true}' : '')
            . ($transition === 'coverflow' ? ',"coverflowEffect":{"slideShadows":' . json_encode($slideShadows) . ', "rotate": ' . esc_attr($rotate) . ', "stretch": ' . esc_attr($stretch) . ', "depth": ' . esc_attr($depth) . ', "modifier": ' . esc_attr($modifier) . '}' : '')
            . ($transition === 'cube' ? ',"cubeEffect":{"slideShadows":' . json_encode($slideShadows) . ', "shadow":' . json_encode($shadow) . ', "shadowOffset":' . esc_attr($shadowOffset) . ', "shadowScale":' . esc_attr($shadowScale) . '}' : '')
            . ($transition === 'flip' ? ', "flipEffect":{"slideShadows":' . json_encode($slideShadows) . ', "limitRotation": ' . json_encode($limitRotation) . '}' : '')
            . ($autoplays ? ',"autoplay":{"delay": '. ($autoplayDuration * 1000) . '}' : '')
            . (!$isDraggable ? ',"simulateTouch":false' : '') . '}\'>' .
        '<div class="swiper-wrapper">' . $gallery
        . '</div><div class="swiper-pagination"></div>
       ' . ($useNavigation ? '<div class="swiper-button-prev"></div> <div class="swiper-button-next"></div>' : "") . '
        </div>';
}

function ub_register_image_slider_block(){
    if ( function_exists( 'register_block_type_from_metadata' ) ) {
        require dirname(dirname(__DIR__)) . '/defaults.php';
        register_block_type_from_metadata(dirname(dirname(dirname(__DIR__))) . '/dist/blocks/image-slider/block.json', array(
            'attributes' => $defaultValues['ub/image-slider']['attributes'],
            'render_callback' => 'ub_render_image_slider_block'));
    }
}

function ub_image_slider_add_frontend_assets() {
	wp_register_script(
		'ultimate_blocks-swiper',
		plugins_url( '/swiper-bundle.js', __FILE__ ),
		array(),
		Ultimate_Blocks_Constants::plugin_version());
    if ( has_block( 'ub/image-slider' ) ) {
        wp_enqueue_script(
            'ultimate_blocks-image-slider-init-script',
            plugins_url( '/front.build.js', __FILE__ ),
            array('ultimate_blocks-swiper'),
            Ultimate_Blocks_Constants::plugin_version(),
            true
        );
    }
}

add_action('init', 'ub_register_image_slider_block');
add_action( 'wp_enqueue_scripts', 'ub_image_slider_add_frontend_assets' );
