<?php

function ub_render_feature_box_block($attributes){
    extract($attributes);

    $column1 = '<div class="ub_feature_1">
    <img class="ub_feature_one_img" src="' . esc_url($imgOneURL) . '" alt="' . esc_attr($imgOneAlt) . '"/>
    <p class="ub_feature_one_title"'.($blockID===''?' style="text-align: '. esc_attr($title1Align) .';"':'').'>' . wp_kses_post($columnOneTitle) . '</p>
    <p class="ub_feature_one_body"'.($blockID===''?' style="text-align: '. esc_attr($body1Align) .';"':'').'>' . wp_kses_post($columnOneBody) . '</p></div>';

    $column2 = '<div class="ub_feature_2">
    <img class="ub_feature_two_img" src="' . esc_url($imgTwoURL) . '" alt="' . esc_attr($imgTwoAlt) . '"/>
    <p class="ub_feature_two_title"'.($blockID===''?' style="text-align: '. esc_attr($title2Align) .';"':'').'>' . wp_kses_post($columnTwoTitle) . '</p>
    <p class="ub_feature_two_body"'.($blockID===''?' style="text-align: '. esc_attr($body2Align) .';"':'').'>' . wp_kses_post($columnTwoBody) . '</p></div>';

    $column3 = '<div class="ub_feature_3">
    <img class="ub_feature_three_img" src="'. esc_url($imgThreeURL) .'" alt="' . esc_attr($imgThreeAlt) . '"/>
    <p class="ub_feature_three_title"'.($blockID===''?' style="text-align: '. esc_attr($title3Align) .';"':'').'>' . wp_kses_post($columnThreeTitle) . '</p>
    <p class="ub_feature_three_body"'.($blockID===''?' style="text-align: '. esc_attr($body3Align) .';"':'').'>' . wp_kses_post($columnThreeBody) . '</p></div>';

    $columns = $column1;

    if((int)$column >= 2){
        $columns .= $column2;
    }
    if((int)$column >= 3){
        $columns .= $column3;
    }

    return '<div class="ub_feature_box column_'. esc_attr($column) .(isset($className) ? ' ' . esc_attr($className) : '').'"'
        .($blockID===''?: ' id="ub_feature_box_'. esc_attr($blockID) .'"').'>'.
    $columns.'</div>';
}

function ub_register_feature_box_block() {
	if ( function_exists( 'register_block_type_from_metadata' ) ) {
        require dirname(dirname(__DIR__)) . '/defaults.php';
        register_block_type_from_metadata( dirname(dirname(dirname(__DIR__))) . '/dist/blocks/feature-box', array(
            'attributes' => $defaultValues['ub/feature-box-block']['attributes'],
			'render_callback' => 'ub_render_feature_box_block'));
	}
}

add_action('init', 'ub_register_feature_box_block');
