<?php

function ub_render_number_box_block($attributes){
    extract($attributes);

    $column1 = '<div class="ub_number_1" style="border-color: '.$borderColor.';">
    <div class="ub_number_box_number" style="background-color: '.$numberBackground.';">
        <p class="ub_number_one_number" style="color: '.$numberColor.';">'.
        $columnOneNumber.'</p>
    </div>
    <p class="ub_number_one_title" style="text-align: '.$title1Align.';">'.
        $columnOneTitle.'</p>
    <p class="ub_number_one_body" style="text-align: '.$body1Align.';">'.
        $columnOneBody.'</p>
    </div>';

    $column2 = '<div class="ub_number_2" style="border-color: '.$borderColor.';">
    <div class="ub_number_box_number" style="background-color: '.$numberBackground.';">
        <p class="ub_number_two_number" style="color: '.$numberColor.';">'.
        $columnTwoNumber.'</p>
    </div>
    <p class="ub_number_two_title" style="text-align: '.$title2Align.';">'.
        $columnTwoTitle.'</p>
    <p class="ub_number_two_body" style="text-align: '.$body2Align.';">'.
        $columnTwoBody.'</p>
    </div>';

    $column3 = '<div class="ub_number_3" style="border-color: '.$borderColor.';">
    <div class="ub_number_box_number" style="background-color: '.$numberBackground.';">
        <p class="ub_number_three_number" style="color: '.$numberColor.';">'.
        $columnThreeNumber.'</p>
    </div>
    <p class="ub_number_three_title" style="text-align: '.$title3Align.';">'.
        $columnThreeTitle.'</p>
    <p class="ub_number_thre_body" style="text-align: '.$body3Align.';">'.
        $columnThreeBody.'</p>
    </div>';

    $columns = $column1;

    if((int)$column >= 2){
        $columns .= $column2;
    }
    if((int)$column >= 3){
        $columns .= $column3;
    }

    return '<div class="ub_number_box column_'.$column.' '.esc_attr($className).'">'.$columns.'</div>';
}

function ub_register_number_box_block() {
	if ( function_exists( 'register_block_type' ) ) {
        register_block_type( 'ub/number-box-block', array(
            'attributes' => array(
                'blockID' => array(
                    'type' =>  'string',
                    'default' => ''
                ),
                'column' => array(
                    'type' => 'string',
                    'default' => '2'
                ),
                'columnOneNumber' => array(
                    'type' => 'string',
                    'default' => ''
                ),
                'columnOneTitle' => array(
                    'type' => 'string',
                    'default' => ''
                ),
                'title1Align' => array(
                    'type' => 'string',
                    'default' => 'center'
                ),
                'columnTwoNumber' => array(
                    'type' => 'string',
                    'default' => ''
                ),
                'columnTwoTitle' => array(
                    'type' => 'string',
                    'default' => ''
                ),
                'title2Align' => array(
                    'type' => 'string',
                    'default' => 'center'
                ),
                'columnThreeNumber' => array(
                    'type' => 'string',
                    'default' => ''
                ),
                'columnThreeTitle' => array(
                    'type' => 'string',
                    'default' => ''
                ),
                'title3Align' => array(
                    'type' => 'string',
                    'default' => 'center'
                ),
                'columnOneBody' => array(
                    'type' => 'string',
                    'default' =>  ''
                ),
                'body1Align' => array(
                    'type' => 'string',
                    'default' => 'left'
                ),
                'columnTwoBody' => array(
                    'type' => 'string',
                    'default' =>  ''
                ),
                'body2Align' => array(
                    'type' => 'string',
                    'default' => 'left'
                ),
                'columnThreeBody' => array(
                    'type' => 'string',
                    'default' =>  ''
                ),
                'body3Align' => array(
                    'type' => 'string',
                    'default' => 'left'
                ),
                'numberBackground' => array(
                    'type' => 'string',
                    'default' => '#CCCCCC'
                ),
                'numberColor' => array(
                    'type' => 'string',
                    'default' => '#000000'
                ),
                'borderColor' => array(
                    'type' => 'string',
                    'default' => '#CCCCCC'
                )
            ),
			'render_callback' => 'ub_render_number_box_block'));
	}
}

add_action('init', 'ub_register_number_box_block');