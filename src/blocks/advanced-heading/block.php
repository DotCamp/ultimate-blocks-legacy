<?php

function ub_register_advanced_heading_block() {
	if ( function_exists( 'register_block_type' ) ) {
        require dirname(dirname(__DIR__)) . '/defaults.php';
		register_block_type( 
            'ub/advanced-heading', 
            array_merge(array(
			'editor_script' => 'advanced-heading-editor-script',
			'editor_style' => 'advanced-heading-editor-style',
			'script' => 'advanced-heading-script',
			'style' => 'advanced-heading-date-style'
		))
        );
	}
	
}

add_action('init', 'ub_register_advanced_heading_block');


?>