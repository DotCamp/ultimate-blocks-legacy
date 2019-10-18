<?php

/**
 * Enqueue frontend script for content toggle block
 *
 * @return void
 */

function ub_render_image_slider_block($attributes){
    extract($attributes);

    $imageArray = count($pics) > 0 ? $pics : json_decode($images, true);
    $captionArray = count($descriptions) > 0 ? $descriptions : json_decode($captions, true);

    $gallery = '';

    foreach($imageArray as $key => $image){
        $gallery .= '<div>
        <img src="'.$image['url'].'"'.($blockID==''?' style="height: '.$sliderHeight.'px;"':'').'>'.
            ($captionArray[$key]['link'] == '' ? '<span' : '<a href="'.esc_url($captionArray[$key]['link']).'"')
            .' class="ub_image_slider_image_caption">'.$captionArray[$key]['text']
            .($captionArray[$key]['link'] == '' ? '</span>' : '</a>').' </div>';
    }

    return '<div class="ub_image_slider'.(isset($className) ? ' ' . esc_attr($className) : '').
            '" '.($blockID==''?'style="min-height: '.(25+ (count($imageArray) > 0) ? $sliderHeight : 200 ).'px;"'
                :'id="ub_image_slider_'.$blockID.'"').'>
                <!--'.$images.'-->'.
        ($gallery == '' ? '' : '<div data-flickity='.json_encode(array('draggable'=>$isDraggable, 'pageDots'=> $showPageDots,
            'wrapAround'=> $wrapsAround, 'autoPlay'=> ($autoplays ? $autoplayDuration * 1000 : $autoplays),
            'adaptiveHeight'=>true )).'>'.$gallery
            .'</div>').'</div>';
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
    if ( has_block( 'ub/image-slider' ) ) {
        wp_enqueue_script(
            'ultimate_blocks-image-slider-front-script',
            plugins_url( '/flickity.pkgd.js', __FILE__ ),
            array(),
            Ultimate_Blocks_Constants::plugin_version()
        );
    }
}

add_action('init', 'ub_register_image_slider_block');
add_action( 'wp_enqueue_scripts', 'ub_image_slider_add_frontend_assets' );