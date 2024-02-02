<?php
function ub_render_advanced_video_block($attributes){
    require_once dirname(dirname(__DIR__)) . '/common.php';
    extract($attributes);
    $classes = array( 'ub-advanced-video-container' );
    $ids = array( 'ub-advanced-video-'.$blockID.'' );

    $block_wrapper_attributes = get_block_wrapper_attributes(
		array(
			'class' => implode(' ', $classes),
			'id'    => implode(' ', $ids)
		)
    );
    //enclosing div needed to prevent embedded video from trying to use the full height of the screen
    return '<div ' . $block_wrapper_attributes . ' >' .

    (!in_array($videoSource, ['local', 'unknown', 'videopress']) && $thumbnail !== '' ?
    ('<div class="ub-advanced-video-thumbnail" style="height:' . $height .'px; width:' . $width . '%;">' .
        '<img class="ub-advanced-video-thumbnail-image" height="100%" width="100%" src="' . esc_url($thumbnail) . '">' .
        '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 60 60" xml:space="preserve" width="' . ($width / 10) . '%">' .
            '<g><path d="M45.563,29.174l-22-15c-0.307-0.208-0.703-0.231-1.031-0.058C22.205,14.289,22,14.629,22,15v30c0,0.371,0.205,0.711,0.533,0.884C22.679,45.962,22.84,46,23,46c0.197,0,0.394-0.059,0.563-0.174l22-15C45.836,30.64,46,30.331,46,30S45.836,29.36,45.563,29.174z M24,43.107V16.893L43.225,30L24,43.107z"/>' .
            '<path d="M30,0C13.458,0,0,13.458,0,30s13.458,30,30,30s30-13.458,30-30S46.542,0,30,0z M30,58C14.561,58,2,45.439,2,30S14.561,2,30,2s28,12.561,28,28S45.439,58,30,58z"/></g>' .
        '</svg></div>') : ''
            ) .
    '<div class="ub-advanced-video-embed' .
        ($autofit && in_array($videoSource, ['youtube', 'vimeo', 'dailymotion']) ? (' ub-advanced-video-autofit-' . $videoSource) : ''   ) . '"' .
        ($thumbnail !== '' && !in_array($videoSource, ['local', 'unknown', 'videopress']) ? ' hidden' : '') . '>'
    . $videoEmbedCode . ($autofit && $videoSource === 'vimeo' ? '<script src="https://player.vimeo.com/api/player.js"></script>' : '') . '</div></div>';
}

function ub_register_advanced_video_block() {
	if ( function_exists( 'register_block_type_from_metadata' ) ) {
        require dirname(dirname(__DIR__)) . '/defaults.php';
		register_block_type_from_metadata( dirname(dirname(dirname(__DIR__))) . '/dist/blocks/advanced-video', array(
            'attributes' => $defaultValues['ub/advanced-video']['attributes'],
			'render_callback' => 'ub_render_advanced_video_block'));
	}
}

function ub_advanced_video_add_frontend_assets() {
    require_once dirname(dirname(__DIR__)) . '/common.php';

    $presentBlocks = ub_getPresentBlocks();

    foreach( $presentBlocks as $block ){
        if($block['blockName'] === 'ub/advanced-video'){
            wp_enqueue_script(
                'ultimate_blocks-advanced-video-front-script',
                plugins_url( 'advanced-video/front.build.js', dirname( __FILE__ ) ),
                array( ),
                Ultimate_Blocks_Constants::plugin_version(),
                true
            );
            break;
        }
    }
}

add_action( 'wp_enqueue_scripts', 'ub_advanced_video_add_frontend_assets' );

add_action('init', 'ub_register_advanced_video_block');