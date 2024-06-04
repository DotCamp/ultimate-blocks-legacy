<?php

function ub_render_number_box_block($attributes){
    extract($attributes);

    $column1 = '<div class="ub_number_1"'.($blockID===''?' style="border-color: '. esc_attr($borderColor) .';"':'').'>
        <div class="ub_number_box_number"'.($blockID===''?' style="background-color: '. esc_attr($numberBackground) .';"':'').'>
            <p class="ub_number_one_number"'.($blockID===''?' style="color: '. esc_attr($numberColor) .';"':'').'>'. wp_kses_post($columnOneNumber) .'</p>
        </div>
        <p class="ub_number_one_title"'.($blockID===''?' style="text-align: '. esc_attr($title1Align) .';"':'').'>'. wp_kses_post($columnOneTitle) .'</p>
        <p class="ub_number_one_body"'.($blockID===''?' style="text-align: '. esc_attr($body1Align) .';"':'').'>'. wp_kses_post($columnOneBody) .'</p>
    </div>';

    $column2 = '<div class="ub_number_2"'.($blockID===''?' style="border-color: '. esc_attr($borderColor) .';"':'').'>
        <div class="ub_number_box_number"'.($blockID===''?' style="background-color: '. esc_attr($numberBackground) .';"':'').'>
            <p class="ub_number_two_number"'.($blockID===''?' style="color: '. esc_attr($numberColor) .';"':'').'>'. wp_kses_post($columnTwoNumber) .'</p>
        </div>
        <p class="ub_number_two_title"'.($blockID===''?' style="text-align: '. esc_attr($title2Align) .';"':'').'>'. wp_kses_post($columnTwoTitle) .'</p>
        <p class="ub_number_two_body"'.($blockID===''?' style="text-align: '. esc_attr($body2Align) .';"':'').'>'. wp_kses_post($columnTwoBody) .'</p>
    </div>';

    $column3 = '<div class="ub_number_3"'.($blockID===''?' style="border-color: '. esc_attr($borderColor) .';"':'').'>
        <div class="ub_number_box_number"'.($blockID===''?' style="background-color: '. wp_kses_post($numberBackground) .';"':'').'>
            <p class="ub_number_three_number"'.($blockID===''?' style="color: '. esc_attr($numberColor) .';"':'').'>'. wp_kses_post($columnThreeNumber) .'</p>
        </div>
        <p class="ub_number_three_title"'.($blockID===''?' style="text-align: '. esc_attr($title3Align) .';"':'').'>'. wp_kses_post($columnThreeTitle) .'</p>
        <p class="ub_number_three_body"'.($blockID===''?' style="text-align: '. esc_attr($body3Align) .';"':'').'>'. wp_kses_post($columnThreeBody) .'</p>
    </div>';

    $columns = $column1;

    if((int)$column >= 2){
        $columns .= $column2;
    }
    if((int)$column >= 3){
        $columns .= $column3;
    }

    return '<div class="ub_number_box column_'. esc_attr($column) .(isset($className) ? ' ' . esc_attr($className) : '').
            '"'.($blockID===''?'':' id="ub-number-box-'. esc_attr($blockID) .'"').'>'. $columns .'</div>';
}

function ub_register_number_box_block() {
	if ( function_exists( 'register_block_type_from_metadata' ) ) {
        require dirname(dirname(__DIR__)) . '/defaults.php';
        register_block_type_from_metadata( dirname(dirname(dirname(__DIR__))) . '/dist/blocks/number-box', array(
            'attributes' => $defaultValues['ub/number-box-block']['attributes'],
			'render_callback' => 'ub_render_number_box_block'));
	}
}

add_action('init', 'ub_register_number_box_block');
