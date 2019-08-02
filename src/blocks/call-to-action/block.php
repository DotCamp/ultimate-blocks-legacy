<?php

function ub_render_call_to_action_block($attributes){
    extract($attributes);
    return '<div class="ub_call_to_action'.(isset($className) ? ' ' . esc_attr($className) : '').
                '" id="ub_call_to_action_'.$blockID.'">
                <div class="ub_call_to_action_headline">
                    <p class="ub_call_to_action_headline_text">'.
                        $ub_call_to_action_headline_text.'</p></div>
                <div class="ub_call_to_action_content">
                    <p class="ub_cta_content_text">'.$ub_cta_content_text.'</p></div>
                <div class="ub_call_to_action_button">
                    <a href="'.esc_url($url).'" target="_'.($openInNewTab ? 'blank' :'self' )
                        .'" rel="'.($addNoFollow ? 'nofollow ' : ' ').'noopener noreferrer"
                        class="wp-block-button ub_cta_button">
                        <p class="ub_cta_button_text">'.
                            $ub_cta_button_text.'</p></a></div></div>';
}

function ub_register_call_to_action_block() {
	if ( function_exists( 'register_block_type' ) ) {
        require dirname(dirname(__DIR__)) . '/defaults.php';
		register_block_type( 'ub/call-to-action-block', array(
            'attributes' => $defaultValues['ub/call-to-action-block']['attributes'],
			'render_callback' => 'ub_render_call_to_action_block'));
	}
}

add_action('init', 'ub_register_call_to_action_block');