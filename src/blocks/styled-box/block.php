<?php

function ub_render_styled_box_bordered_content($attributes, $content){
    return $content;
}

function ub_register_styled_box_bordered_box_block() {
	if( function_exists( 'register_block_type' ) ) {
		register_block_type( 'ub/styled-box-bordered-content', array(
            'attributes' => array(),
            'render_callback' => 'ub_render_styled_box_bordered_content')
        );
    }
}

add_action('init', 'ub_register_styled_box_bordered_box_block');

function ub_render_styled_box_numbered_box_column($attributes, $content){
    extract($attributes);
    return '<div class="ub-number-panel">
        <div class="ub-number-container">
            <p class="ub-number-display">' . $number . '</p>
        </div>
        <p class="ub-number-box-title">' . $title . '</p>
        <div class="ub-number-box-body">' . $content . '</div>
    </div>';
}

function ub_register_styled_box_numbered_box_column_block() {
	if( function_exists( 'register_block_type' ) ) {
		register_block_type( 'ub/styled-box-numbered-box-column', array(
            'attributes' => array(
                'number' => array(
                    'type' => 'string',
                    'default' => ''
                ),
                'title' => array(
                    'type' => 'string',
                    'default' => ''
                ),
                'titleAlign' => array(
                    'type' => 'string',
                    'default' => 'center'
                ),
                'numberColor' => array(
                    'type' => 'string',
                    'default' => ''
                ),
                'backColor' => array(
                    'type' => 'string',
                    'default' => ''
                ),
                'borderColor' => array(
                    'type' => 'string',
                    'default' => ''
                )
            ),
            'render_callback' => 'ub_render_styled_box_numbered_box_column')
        );
    }
}

add_action('init', 'ub_register_styled_box_numbered_box_column_block');

function ub_render_styled_box_block($attributes, $content){
    extract($attributes);
    $renderedBlock = '';
    if($mode === 'notification' && $text[0] != ''){
        $renderedBlock = '<div class="ub-notification-text">'.$text[0].'</div>';
    }
    else if($mode === 'feature'){
        foreach(range(0, count($text)-1) as $i){
            $renderedBlock .= '<div class="ub-feature">'.
                ($image[$i]['url'] === '' ? '' :
                    '<img class="ub-feature-img" src="'.$image[$i]['url'].'"/>').
                    '<p class="ub-feature-title">'.$title[$i].'</p>
                    <p class="ub-feature-body">'.$text[$i].'</p>
            </div>';
        }
    }
    else if($mode === 'number'){
        if(count( array_filter($text, function($item){return $item !== '';}) ) > 0 ||
                count( array_filter($title, function($item){return $item !== '';}) ) > 0){
            foreach(range(0, count($text)-1) as $i){
                $renderedBlock .= '<div class="ub-number-panel">
                    <div class="ub-number-container">
                        <p class="ub-number-display">'.$number[$i].'</p>
                    </div>
                    <p class="ub-number-box-title">'.$title[$i].'</p>
                    <p class="ub-number-box-body">'.$text[$i].'</p>
                </div>';
            }
        }
        else {
            $renderedBlock = $content;
        }
    }
    else if(in_array($mode, array('bordered', 'notification'))){
        $renderedBlock = $content;
    }

    return '<div class="ub-styled-box ub-'.$mode.'-box'.(isset($className) ? ' ' . esc_attr($className) : '')
            .'" id="ub-styled-box-'.$blockID.'">'.
                $renderedBlock.'</div>';
}

function ub_register_styled_box_block() {
	if( function_exists( 'register_block_type' ) ) {
        require dirname(dirname(__DIR__)) . '/defaults.php';
		register_block_type( 'ub/styled-box', array(
            'attributes' => $defaultValues['ub/styled-box']['attributes'],
            'render_callback' => 'ub_render_styled_box_block'));
    }
}

add_action('init', 'ub_register_styled_box_block');