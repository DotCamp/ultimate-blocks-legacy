<?php

function ub_render_advanced_heading_block($attributes){
    extract($attributes);
	return '<' . $level . ' class="ub_advanced_heading" id="' . ($anchor ?: 'ub-advanced-heading-'. $blockID) . '" data-blockid="' . $blockID . '">' . $content . '</' . $level . '>';
}

function ub_register_advanced_heading_block() {
	if ( function_exists( 'register_block_type' ) ) {
        require dirname(dirname(__DIR__)) . '/defaults.php';
		register_block_type( 
            'ub/advanced-heading', 
            array(
			'attributes' => $defaultValues['ub/advanced-heading']['attributes'],
			'render_callback' => 'ub_render_advanced_heading_block')
		);
	}
}

add_action('init', 'ub_register_advanced_heading_block');