<?php

function ub_generateStarDisplay($value, $limit, $id, $inactiveStarColor,
    $activeStarColor, $className=''){
    $stars = '';

    foreach(range(0, $limit-1) as $current){
        $stars .= '<svg height="20" width="20" viewbox="0 0 150 150">
        <defs><mask id="ub_review_star_filter-'.$id.'-'.$current
        .'"><rect height="150" width="'.($value - $current > 0 ?
            ($value - $current < 1 ? $value - $current : 1) : 0)*150
        .'" y="0" x="0" fill="#fff"/></mask></defs> <path fill="'.$inactiveStarColor.'" stroke-width="1.5"
        d="m0.75,56.89914l56.02207,0l17.31126,-56.14914l17.31126,56.14914l56.02206,0l-45.32273,34.70168l17.31215,56.14914l-45.32274,-34.70262l-45.32274,34.70262l17.31215,-56.14914l-45.32274,-34.70168z"
        stroke="#000"/><path class="star" id="star'.$current.
        '" mask="url(#ub_review_star_filter-'.$id.'-'.$current.')" fill="'.$activeStarColor.'" strokeWidth="1.5"
        d="m0.75,56.89914l56.02207,0l17.31126,-56.14914l17.31126,56.14914l56.02206,0l-45.32273,34.70168l17.31215,56.14914l-45.32274,-34.70262l-45.32274,34.70262l17.31215,-56.14914l-45.32274,-34.70168z"
        stroke="#000"/>
        </svg>';
    }

    return '<div class="'.$className.'">'.$stars.'</div>';
}

function ub_render_review_block($attributes){
    extract($attributes);
    $parsedItems = json_decode($items, true);

    $extractedValues = array_map(function($item){
                                    return $item['value'];
                                }, $parsedItems);

    $average = round(array_sum($extractedValues)/count($extractedValues),1);

    $starRatings = '';

    foreach($parsedItems as $key=>$item){
        $starRatings .= '<div class="ub_review_entry">'.$item['label'].
        ub_generateStarDisplay($item['value'],$starCount, $blockID.'-'.$key,
        $inactiveStarColor, $activeStarColor, "ub_review_stars").'</div>';
    }

    return 	'<div class="ub_review_block'.(isset($className) ? ' ' . esc_attr($className) : '').
                '" id="#ub_review_'.$blockID.'">
        <p class="ub_review_item_name">'.
            $itemName.'</p>
        <p class="ub_review_author_name">'.$authorName.'</p>'.
            $starRatings
    .'<div class="ub_review_summary">
        <p class="ub_review_summary_title">'.$summaryTitle.'</p>
        <div class="ub_review_overall_value">   
            <p>'.$summaryDescription.'</p>
            <span class="ub_review_rating">'.$average.'</span>
        </div>
        <div class="ub_review_cta_panel">
            <div class="ub_review_cta_main">
                <a href="'.  ($callToActionURL == '' ? '#' : esc_url($callToActionURL)).
                    '" target="_blank" rel="nofollow noopener noreferrer">
                    <button class="ub_review_cta_btn">'.
                        ($callToActionText==''?'Click here':$callToActionText).'</button></a></div>'.
                    ub_generateStarDisplay($average,$starCount, $blockID.'-average',
                    $inactiveStarColor, $activeStarColor, "ub_review_average_stars").'
                </div></div>
    <script type="application/ld+json">
        {"@context":"http://schema.org/","@type":"Review","reviewBody":"'.
            $summaryDescription.'","itemReviewed":{"@type":"Product","name":"'.$itemName.
            '"},"reviewRating":{"@type":"Rating","ratingValue":'.$average
            .',"bestRating":'.$starCount.'},"author":{"@type":"Person","name":"'.$authorName.'"}}</script>
</div>';
}

function ub_register_review_block() {
	if( function_exists( 'register_block_type' ) ) {
        require dirname(dirname(__DIR__)) . '/defaults.php';
		register_block_type( 'ub/review', array(           
            'attributes' => $defaultValues['ub/review']['attributes'],
            'render_callback' => 'ub_render_review_block'));
    }
}

add_action('init', 'ub_register_review_block');