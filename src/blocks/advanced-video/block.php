<?php
function ub_render_advanced_video_block($attributes){
    require_once dirname(dirname(__DIR__)) . '/common.php';
    extract($attributes);

    //enclosing div needed to prevent embedded video from trying to use the full height of the screen
    return '<div id="ub-advanced-video-'.$blockID.'" class="ub-advanced-video-container">' .
    
    (!in_array($videoSource, ['local', 'unknown', 'videopress']) && $thumbnail !== '' ? 
    '<img class="ub-advanced-video-thumbnail" height="'.$height.'" width="'.$width.'" src="' . esc_url($thumbnail) . '">' : ''
            ) .
    '<div class="ub-advanced-video-embed" '.($thumbnail !== '' && !in_array($videoSource, ['local', 'unknown', 'videopress']) ? 'hidden' : '').'>'
    . $videoEmbedCode . '</div></div>';
}

function ub_register_advanced_video_block() {
	if ( function_exists( 'register_block_type' ) ) {
        require dirname(dirname(__DIR__)) . '/defaults.php';
		register_block_type( 'ub/advanced-video', array(
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