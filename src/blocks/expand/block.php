<?php

function ub_render_expand_portion_block($attributes, $content){
    extract($attributes);
    return '<div class="ub-expand-portion ub-expand-' . $displayType .
        ($displayType === 'full' ? ' ub-hide' : '').
        (isset($className) ? ' ' . esc_attr($className) : '') . '">' .
        $content.
        '<a class="ub-expand-toggle-button" role="button" aria-expanded="false" aria-controls="'.
            ($parentID === '' ? '' : "ub-expand-full-" . $parentID).'" tabindex="0">' . $clickText . '</a>'
        . '</div>';
}

function ub_register_expand_portion_block($attributes){
    if ( function_exists( 'register_block_type_from_metadata' ) ) {
        require dirname(dirname(__DIR__)) . '/defaults.php';
        register_block_type_from_metadata( dirname(dirname(dirname(__DIR__))) . '/dist/blocks/expand/expand-portion/block.json', array(
            'attributes' => $defaultValues['ub/expand-portion']['attributes'],
			'render_callback' => 'ub_render_expand_portion_block'));
	}
}

function ub_render_expand_block($attributes, $content){
    extract($attributes);

    $scrollTargetPrefix = '';

    switch($scrollTargetType){
        case 'id':
            $scrollTargetPrefix = '#';
            break;
        case 'class':
            $scrollTargetPrefix = '.';
            break;
        case 'element':
        default:
            $scrollTargetPrefix = '';
    }

    return '<div class="wp-block-ub-expand ub-expand '.(isset($className) ? ' ' . esc_attr($className) : '')
    
    .'" id="ub-expand-'.$blockID.'"' .  ($allowScroll ? (' data-scroll-type="' . $scrollOption . '"' . ($scrollOption === 'fixedamount' ? ' data-scroll-amount="' . $scrollOffset . '"' : '')
    . ($scrollOption === 'namedelement' ? ' data-scroll-target="' . $scrollTargetPrefix . $scrollTarget . '"' : '')) : '' ) . '>'.$content.'</div>';
}

function ub_register_expand_block($attributes){
    if ( function_exists( 'register_block_type_from_metadata' ) ) {
        require dirname(dirname(__DIR__)) . '/defaults.php';
        register_block_type_from_metadata( dirname(dirname(dirname(__DIR__))) . '/dist/blocks/expand/block.json', array(
            'attributes' => $defaultValues['ub/expand']['attributes'],
			'render_callback' => 'ub_render_expand_block'));
	}
}

function ub_expand_block_add_frontend_assets() {
    require_once dirname(dirname(__DIR__)) . '/common.php';

    $presentBlocks = ub_getPresentBlocks();

    foreach( $presentBlocks as $block ){
        if($block['blockName'] === 'ub/expand' || $block['blockName'] === 'ub/expand-portion'){
            wp_enqueue_script(
                'ultimate_blocks-expand-block-front-script',
                plugins_url( 'expand/front.build.js', dirname( __FILE__ ) ),
                array( ),
                Ultimate_Blocks_Constants::plugin_version(),
                true
            );
            break;
        }
    }
}

add_action('init', 'ub_register_expand_block');
add_action('init', 'ub_register_expand_portion_block');
add_action( 'wp_enqueue_scripts', 'ub_expand_block_add_frontend_assets' );