<?php

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
        <img src="' . $image['url'] . '" alt="' . esc_html($image['alt']) . '"' .
            ($blockID === '' ? ' style="height: ' . $sliderHeight . 'px;"' : '') . '>' .
            '<figcaption class="ub_image_slider_image_caption">' . ($captionArray[$key]['link'] === '' ? '' : '<a href="' . esc_url($captionArray[$key]['link']) . '">')
            . $captionArray[$key]['text']
            . ($captionArray[$key]['link'] === '' ? '' : '</a>') . ' </figcaption></figure>';
    }

    return '<div class="ub_image_slider swiper-container' . (isset($className) ? ' ' . esc_attr($className) : '') .
        '" ' . ($blockID === '' ? 'style="min-height: ' . (25 + (count($imageArray) > 0) ? $sliderHeight : 200) . 'px;"'
        : 'id="ub_image_slider_' . $blockID . '"').
        ' data-swiper-data=\'{"loop":' . json_encode($wrapsAround) .
            ',"pagination":{"el": ' . ($usePagination ? '".swiper-pagination"' : 'null') . ' , "type": "' . $paginationType . '"'.($paginationType === 'bullets' ? ', "clickable":true' :'') . '}
            ,"navigation": {"nextEl": ".swiper-button-next", "prevEl": ".swiper-button-prev"},  "keyboard": { "enabled": true },
            "effect": "' . $transition . '"'
            . ($transition === 'fade' ? ',"fadeEffect":{"crossFade": true}' : '')
            . ($transition === 'coverflow' ? ',"coverflowEffect":{"slideShadows":' . json_encode($slideShadows) . ', "rotate": ' . $rotate . ', "stretch": ' . $stretch . ', "depth": ' . $depth . ', "modifier": ' . $modifier . '}' : '')
            . ($transition === 'cube' ? ',"cubeEffect":{"slideShadows":' . json_encode($slideShadows) . ', "shadow":' . json_encode($shadow) . ', "shadowOffset":' . $shadowOffset . ', "shadowScale":' . $shadowScale . '}' : '')
            . ($transition === 'flip' ? ', "flipEffect":{"slideShadows":' . json_encode($slideShadows) . ', "limitRotation": ' . json_encode($limitRotation) . '}' : '')
            . ($autoplays ? ',"autoplay":{"delay": '. ($autoplayDuration * 1000) . '}' : '')
            . (!$isDraggable ? ',"simulateTouch":false' : '') . '}\'>' .
        '<div class="swiper-wrapper">' . $gallery
        . '</div><div class="swiper-pagination"></div>
        <div class="swiper-button-prev"></div> <div class="swiper-button-next"></div>
        </div>';
}

function ub_register_image_slider_block(){
    if ( function_exists( 'register_block_type' ) ) {
        require dirname(dirname(__DIR__)) . '/defaults.php';
        register_block_type('ub/image-slider', array(
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