<?php

function ub_render_testimonial_block($attributes){
    extract($attributes);
    return '<div>
    <div class="ub_testimonial"
        style= "background-color: '.$backgroundColor.'; color: '.$textColor.';">
        <div class="ub_testimonial_img">
            <img src="'.$imgURL.'" alt="'.$imgAlt.'" height="100" width="100" />
        </div>
        <div class="ub_testimonial_content">
            <p class="ub_testimonial_text" style="font-size: '.$textSize.'; text-align: '.$textAlign.';">'.
            $ub_testimonial_text.'</p>
        </div>
        <div class="ub_testimonial_sign">
            <p class="ub_testimonial_author" style="text-align: '.$authorAlign.';">'.
                $ub_testimonial_author.'</p>
            <p class="ub_testimonial_author_role" style="text-align: '.$authorRoleAlign.';">'.
                $ub_testimonial_author_role.'</p>
        </div>
    </div>
</div>';
}

function ub_register_testimonial_block() {
	if( function_exists( 'register_block_type' ) ) {
		register_block_type( 'ub/testimonial', array(
            'attributes' => array(
                'ub_testimonial_text' => array(
                    'type' => 'string',
                    'default' => ''
                ),
                'textAlign' => array(
                    'type' => 'string',
                    'default' => 'justify'
                ),
                'ub_testimonial_author' => array(
                    'type' => 'string',
                    'default' => ''
                ),
                'authorAlign' => array(
                    'type' => 'string',
                    'default' => 'right'
                ),
                'ub_testimonial_author_role' => array(
                    'type' => 'string',
                    'default' => ''
                ),
                'authorRoleAlign' => array(
                    'type' => 'string',
                    'default' => 'right'
                ),
                'imgURL' => array(
                    'type' => 'string',
                    'default' => ''
                ),
                'imgID' => array(
                    'type' => 'number',
                ),
                'imgAlt' => array(
                    'type' => 'string',
                    'default' => ''
                ),
                'backgroundColor' => array(
                    'type' => 'string',
                    'default' => '#f4f6f6'
                ),
                'textColor' => array(
                    'type' => 'string',
                    'default' => '#444444'
                ),
                'textSize' => array(
                    'type' => 'number',
                    'default' => 17
                ),
            ),
            'render_callback' => 'ub_render_testimonial_block'));
    }
}

add_action('init', 'ub_register_testimonial_block');