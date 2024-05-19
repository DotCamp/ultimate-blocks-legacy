<?php

/**
 * Enqueue frontend script for button block
 *
 * @return void
 */




function ub_render_buttons_block($attributes, $block_content){
    require_once dirname(dirname(__DIR__)) . '/common.php';
    extract($attributes);

     $classes = array();
     $classes[] = 'ub-buttons';
     if($align === ''){
          $classes[] = 'align-button-center';
     } else{
          $classes[] = 'align-button-' . $align . '';
     }
    $classes[] = 'orientation-button-' . $orientation . '';
    if($isFlexWrap){
        $classes[] = 'ub-flex-wrap';
    }
    $block_attributes = get_block_wrapper_attributes(
            array(
                'class' => implode(" ", $classes),
                'id'    => 'ub-buttons-' . $blockID . ''
            )
    );

	return '<div '. $block_attributes .  '>' . $block_content . '</div>';
}

function ub_register_buttons_block() {
	if ( function_exists( 'register_block_type_from_metadata' ) ) {
        require dirname(dirname(__DIR__)) . '/defaults.php';
		register_block_type_from_metadata( dirname(dirname(dirname(__DIR__))) . '/dist/blocks/buttons', array(
            'attributes' => $defaultValues['ub/buttons']['attributes'],
			'render_callback' => 'ub_render_buttons_block'));
	}
}

add_action('init', 'ub_register_buttons_block');
