<?php

function ub_render_testimonial_block($attributes){
    extract($attributes);
    return '<div>
    <div class="ub_testimonial'.(isset($className) ? ' ' . esc_attr($className) : '').
            '" id="ub_testimonial_'.$blockID.'">
        <div class="ub_testimonial_img">
            <img src="'.$imgURL.'" alt="'.$imgAlt.'" height="100" width="100" />
        </div>
        <div class="ub_testimonial_content">
            <p class="ub_testimonial_text">'.$ub_testimonial_text.'</p>
        </div>
        <div class="ub_testimonial_sign">
            <p class="ub_testimonial_author">'.$ub_testimonial_author.'</p>
            <p class="ub_testimonial_author_role">'.$ub_testimonial_author_role.'</p>
        </div>
    </div>
</div>';
}

function ub_register_testimonial_block() {
	if( function_exists( 'register_block_type' ) ) {
        require dirname(dirname(__DIR__)) . '/defaults.php';
		register_block_type( 'ub/testimonial', array(
            'attributes' =>$defaultValues['ub/testimonial']['attributes'],
            'render_callback' => 'ub_render_testimonial_block'));
    }
}

add_action('init', 'ub_register_testimonial_block');