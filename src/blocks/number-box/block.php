<?php

function ub_render_number_box_block($attributes){
    extract($attributes);

    $column1 = '<div class="ub_number_1">
        <div class="ub_number_box_number">
            <p class="ub_number_one_number">'.$columnOneNumber.'</p>
        </div>
        <p class="ub_number_one_title">'.$columnOneTitle.'</p>
        <p class="ub_number_one_body">'.$columnOneBody.'</p>
    </div>';

    $column2 = '<div class="ub_number_2">
        <div class="ub_number_box_number">
            <p class="ub_number_two_number">'.$columnTwoNumber.'</p>
        </div>
        <p class="ub_number_two_title">'.$columnTwoTitle.'</p>
        <p class="ub_number_two_body">'.$columnTwoBody.'</p>
    </div>';

    $column3 = '<div class="ub_number_3">
        <div class="ub_number_box_number">
            <p class="ub_number_three_number">'.$columnThreeNumber.'</p>
        </div>
        <p class="ub_number_three_title">'.$columnThreeTitle.'</p>
        <p class="ub_number_three_body">'.$columnThreeBody.'</p>
    </div>';

    $columns = $column1;

    if((int)$column >= 2){
        $columns .= $column2;
    }
    if((int)$column >= 3){
        $columns .= $column3;
    }

    return '<div class="ub_number_box column_'.$column.(isset($className) ? ' ' . esc_attr($className) : '').
            '" id="ub-number-box-'.$blockID.'">'.$columns.'</div>';
}

function ub_register_number_box_block() {
	if ( function_exists( 'register_block_type' ) ) {
        require dirname(dirname(__DIR__)) . '/defaults.php';
        register_block_type( 'ub/number-box-block', array(
            'attributes' => $defaultValues['ub/number-box-block']['attributes'],
			'render_callback' => 'ub_render_number_box_block'));
	}
}

add_action('init', 'ub_register_number_box_block');