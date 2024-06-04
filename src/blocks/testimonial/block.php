<?php

function ub_render_testimonial_block($attributes){
    extract($attributes);
    return '<div>
    <div class="wp-block-ub-testimonial ub_testimonial'.(isset($className) ? ' ' . esc_attr($className) : '').
            '"'.($blockID === '' ? 'style= "background-color: ' . esc_attr($backgroundColor) . '; color: ' . esc_attr($textColor) . ';"'
                :' id="ub_testimonial_' . esc_attr($blockID) . '"') . '>
        <div class="ub_testimonial_img">
            <img src="' . esc_url($imgURL) . '" alt="' . esc_attr($imgAlt) . '" height="100" width="100" />
        </div>
        <div class="ub_testimonial_content">
            <p class="ub_testimonial_text"'.
                ($blockID === '' ? ' style="font-size: ' . esc_attr($textSize) .'px; text-align: ' . esc_attr($textAlign) . ';"' : '') . '>'.
                wp_kses_post($ub_testimonial_text) . '</p>
        </div>
        <div class="ub_testimonial_sign">
            <p class="ub_testimonial_author"'.
                ($blockID === '' ? ' style="font-size: ' . esc_attr($textSize) . 'px; text-align: ' . esc_attr($authorAlign) .';"' : '') . '>'.
                wp_kses_post($ub_testimonial_author) .'</p>
            <p class="ub_testimonial_author_role"'.
                ($blockID === '' ? ' style="font-size: ' . esc_attr($textSize) . 'px; text-align: ' . esc_attr($authorRoleAlign) . ';"' : '') . '>'.
                wp_kses_post($ub_testimonial_author_role) . '</p>
        </div>
    </div>
</div>';
}

function ub_register_testimonial_block() {
	if( function_exists( 'register_block_type_from_metadata' ) ) {
        require dirname(dirname(__DIR__)) . '/defaults.php';
		register_block_type_from_metadata(dirname(dirname(dirname(__DIR__))) . '/dist/blocks/testimonial', array(
            'attributes' =>$defaultValues['ub/testimonial']['attributes'],
            'render_callback' => 'ub_render_testimonial_block'));
    }
}

add_action('init', 'ub_register_testimonial_block');
