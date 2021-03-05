<?php

function ub_render_notification_box_block($attributes){
    extract($attributes);
    return '<div>
    <div class="wp-block-ub-notification-box '.$ub_selected_notify.
        (isset($className) ? ' ' . esc_attr($className) : '').'"'.($blockID===''? :' id="ub-notification-box-'.$blockID.'"').'>
        <p class="ub_notify_text"'.($blockID===''?' style="text-align: '.$align.';"':'').'>'.$ub_notify_info.'</p>
    </div>
</div>';
}

function ub_register_notification_box_block() {
	if ( function_exists( 'register_block_type' ) ) {
        require dirname(dirname(__DIR__)) . '/defaults.php';
        register_block_type( 'ub/notification-box-block', array(
            'attributes' => $defaultValues['ub/notification-box-block']['attributes'],
			'render_callback' => 'ub_render_notification_box_block'));
	}
}

add_action('init', 'ub_register_notification_box_block');