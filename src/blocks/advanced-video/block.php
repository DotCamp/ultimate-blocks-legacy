<?
function ub_render_advanced_video_block($attributes){
    require_once dirname(dirname(__DIR__)) . '/common.php';
    extract($attributes);

    //enclosing div needed to prevent embedded video from trying to use the full height of the screen
    return '<div>' . $videoEmbedCode . '</div>';
}

function ub_register_advanced_video_block() {
	if ( function_exists( 'register_block_type' ) ) {
        require dirname(dirname(__DIR__)) . '/defaults.php';
		register_block_type( 'ub/advanced-video', array(
            'attributes' => $defaultValues['ub/advanced-video']['attributes'],
			'render_callback' => 'ub_render_advanced_video_block'));
	}
}

add_action('init', 'ub_register_advanced_video_block');