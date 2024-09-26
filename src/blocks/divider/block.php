<?php

function ub_render_divider_block($attributes){
    extract($attributes);

	$classNames = array( "wp-block-ub-divider" );

	if(isset($orientation)){
		array_push($classNames, 'ub-divider-orientation-'. $orientation .'');
	}
	if(isset($align)){
		array_push($classNames, 'align'. $align .'');
	}

	$wrapper_attributes = get_block_wrapper_attributes(
               array(
                    'class' => join(' ', $classNames),
					'id'	=> 'ub_divider_' . $blockID .''
               )
	);

    $divider_style = $orientation === 'horizontal' ?
        'margin-top: ' . esc_attr($borderHeight) . 'px; margin-bottom: ' . esc_attr($borderHeight) . 'px;"' :
        'width:fit-content; height:'. esc_attr($lineHeight) .'';
    return '<div ' . $wrapper_attributes . '><hr class="ub_divider'.(isset($className) ? ' ' . esc_attr($className) : '').'" '.
    ($blockID === '' ? 'style="'.($orientation === 'horizontal' ? 'border-top' : 'border-left').': ' . esc_attr($borderSize) . 'px ' . esc_attr($borderStyle) . ' ' . esc_attr($borderColor) . ';'. $divider_style .'' :'') . '></hr></div>';
}

function ub_register_divider_block(){
    if ( function_exists( 'register_block_type_from_metadata' ) ) {
        require dirname(dirname(__DIR__)) . '/defaults.php';
        register_block_type_from_metadata( dirname(dirname(dirname(__DIR__))) . '/dist/blocks/divider', array(
            'attributes' => $defaultValues['ub/divider']['attributes'],
            'render_callback' => 'ub_render_divider_block'));
    }
}

add_action('init', 'ub_register_divider_block');
