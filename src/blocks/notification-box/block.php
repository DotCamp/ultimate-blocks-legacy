<?php

function ub_render_notification_box_block($attributes){
    extract($attributes);
    return '<div>
    <div class="'.$ub_selected_notify.'">
        <p class="ub_notify_text" style="text-align: '.$align.';">'.$ub_notify_info.'</p>
    </div>
</div>';
}

function ub_register_notification_box_block() {
	if ( function_exists( 'register_block_type' ) ) {
        register_block_type( 'ub/notification-box-block', array(
            'attributes' => array(
                'ub_selected_notify' => array(
                    'type' => 'string',
                    'default' => 'ub_notify_info'
                ),
                'ub_notify_info' => array(
                    'type' => 'string',
                    'default' => ''
                ),
                'align' => array(
                    'type' => 'string',
                    'default' => 'left'
                )
            ),
			'render_callback' => 'ub_render_notification_box_block'));
	}
}

add_action('init', 'ub_register_notification_box_block');