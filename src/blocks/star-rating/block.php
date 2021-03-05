<?php

function ub_make_full_star($size, $color){
    return '<svg xmlns="http://www.w3.org/2000/svg" fill="' . $color . '" width="' . $size . '" height="' . $size . '" viewBox="0 0 510 510">
        <polygon points="255,402.212 412.59,497.25 370.897,318.011 510,197.472 326.63,181.738 255,12.75 183.371,181.738 0,197.472 139.103,318.011 97.41,497.25"/>
    </svg>';
}

function ub_make_half_star($size, $color){
    return '<svg xmlns="http://www.w3.org/2000/svg" fill="' . $color.'" width="' . $size . '" height="' . $size . '" viewBox="0 0 510 510">
    <path d="M510,197.472l-183.37-15.734L255,12.75l-71.629,168.988L0,197.472l0,0l0,0l139.103,120.539L97.41,497.25L255,402.186l0,0 l157.59,95.039l-41.692-179.239L510,197.472z M255,354.348V117.172l43.605,102.918l111.689,9.588l-84.711,73.389l25.398,109.166 L255,354.348z" />
    </svg>';
}

function ub_make_empty_star($size){
    return '<svg xmlns="http://www.w3.org/2000/svg" width="' . $size . '" height="' . $size . '" viewBox="0 0 510 510">
        <path d="M510,197.472l-183.37-15.734L255,12.75l-71.629,168.988L0,197.472l139.103,120.539L97.41,497.25L255,402.186 l157.59,95.064l-41.692-179.239L510,197.472z M255,354.348l-95.957,57.886l25.398-109.166l-84.736-73.389l111.69-9.588 L255,117.172l43.605,102.918l111.689,9.588l-84.711,73.389l25.398,109.166L255,354.348z" />
    </svg>';
}

function ub_render_star_rating_block($attributes){
    extract($attributes);
    $stars = '';
    for($i = 0; $i < $starCount; $i++){
        $stars .= $i < $selectedStars ?
            ($selectedStars - $i >= 1 ?
                ub_make_full_star($starSize, $starColor) : ub_make_half_star($starSize, $starColor))
            : ub_make_empty_star($starSize);
    }
    if($blockID === ''){
        $stars = preg_replace_callback('/<svg ([^>]+)>/', function($svgAttributes){
            if(preg_match('/fill=\"([^"]+)\"/', $svgAttributes[1], $matches)){
                return '<svg ' . $svgAttributes[1] . ' style="fill:' . $matches[1] . ';">';
            }
            return $svgAttributes[0];
        }, $stars);
    }

    return '<div class="ub-star-rating' . (isset($className) ? ' ' . esc_attr($className) : '') .
            '"' . ($blockID === '' ? '' : ' id="ub-star-rating-' . $blockID . '"') . '>
                <div class="ub-star-outer-container"' .
                    ($blockID === '' ? '  style="justify-content:' . ($starAlign === 'center' ? 'center' :
                    ('flex-' . $starAlign === 'left' ? 'start' : 'end')) . ';"' : '').'>
                    <div class="ub-star-inner-container">'.$stars.'</div>
                </div>'.
                ($reviewText === '' ? '' : '<div class="ub-review-text"' . ($blockID === '' ? ' style="text-align:' . $reviewTextAlign . ';"' : '') . '>' . 
                    $reviewText
                . '</div>') .
            '</div>';
}

function ub_register_star_rating_block() {
	if( function_exists( 'register_block_type' ) ) {
        require dirname(dirname(__DIR__)) . '/defaults.php';
		register_block_type( 'ub/star-rating-block', array(
            'attributes' => $defaultValues['ub/star-rating-block']['attributes'],
            'render_callback' => 'ub_render_star_rating_block'));
    }
}

add_action('init', 'ub_register_star_rating_block');