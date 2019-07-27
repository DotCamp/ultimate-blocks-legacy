<?php

function ub_generateStarDisplay($value, $limit, $id, $inactiveStarColor,
    $activeStarColor, $customStyle='', $className=''){
    $stars = '';

    foreach(range(0, $limit-1) as $current){
        $stars .= '<svg height="20" width="20" viewbox="0 0 150 150">
        <defs><mask id="ub_review_star_filter-'.$id.'-'.$current
        .'"><rect height="150" width="'.($value - $current > 0 ?
            ($value - $current < 1 ? $value - $current : 1) : 0)*150
        .'" y="0" x="0" fill="#fff"/></mask></defs> <path fill="'.$inactiveStarColor.'" stroke-width="1.5"
        d="m0.75,56.89914l56.02207,0l17.31126,-56.14914l17.31126,56.14914l56.02206,0l-45.32273,34.70168l17.31215,56.14914l-45.32274,-34.70262l-45.32274,34.70262l17.31215,-56.14914l-45.32274,-34.70168z"
        stroke="#000"/><path class="star" id="star'.
        $current.'" mask="url(#ub_review_star_filter-'.$id.'-'.$current.')" fill="'.$activeStarColor.'" strokeWidth="1.5"
        d="m0.75,56.89914l56.02207,0l17.31126,-56.14914l17.31126,56.14914l56.02206,0l-45.32273,34.70168l17.31215,56.14914l-45.32274,-34.70262l-45.32274,34.70262l17.31215,-56.14914l-45.32274,-34.70168z"
        stroke="#000"/>
        </svg>';
    }

    return '<div class="'.$className.'" style="'.$customStyle.'">'.$stars.'</div>';
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
        $inactiveStarColor, $activeStarColor, "margin-left: auto;").'</div>';
    }

    return 	'<div class="ub_review_block '.esc_attr($className).'">
        <p class="ub_review_item_name" style="text-align: '.$textAlign.';">'.
            $itemName.'</p>
        <p style="text-align: '.$authorAlign.';">'.$authorName.'</p>'.
            $starRatings
    .'<div class="ub_review_summary">
        <p class="ub_review_summary_title">'.$summaryTitle.'</p>
        <div class="ub_review_overall_value">   
            <p>'.$summaryDescription.'</p>
            <span class="ub_review_rating">'.$average.'</span>
        </div>
        <div class="ub_review_cta_panel">
            <div class="ub_review_cta_main">
                <a style="color: '.$callToActionForeColor.';" href="'.
                    ($callToActionURL == '' ? '#' : esc_url($callToActionURL)).'" target="_blank"
                    rel="nofollow noopener noreferrer">
                    <button class="ub_review_cta_btn" style="background-color: '.$callToActionBackColor
                        .'; border-color: '.$callToActionForeColor.'; color: '.$callToActionForeColor.';">'.
                        ($callToActionText==''?'Click here':$callToActionText).'</button></a></div>'.
                    ub_generateStarDisplay($average,$starCount, $blockID.'-average',
                    $inactiveStarColor, $activeStarColor, "", "ub_review_average_stars").'
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
		register_block_type( 'ub/review', array(           
            'attributes' => array(
                'blockID' => array(
                    'type' => 'string',
                    'default' => ''
                ),
                'authorName' => array(
                    'type' => 'string',
                    'default' => ''
                ),
                'itemName' => array(
                    'type' => 'string',
                    'default' => ''
                ),
                'items' => array(
                    'type' => 'string',
                    'default' => '[{"label": "", "value": 0}]'
                ),
                'starCount' => array(
                    'type' => 'number',
                    'default' => 5
                ),
                'summaryTitle' => array(
                    'type' => 'string',
                    'default' => 'Summary'
                ),
                'summaryDescription' => array(
                    'type' => 'string'
                ),
                'callToActionText' => array(
                    'type' => 'string',
                ),
                'callToActionURL' => array(
                    'type' => 'string',
                    'default' => ''
                ),
                'callToActionBackColor' => array(
                    'type' => 'string',
                    'default' => '#f63d3d'
                ),
                'callToActionForeColor' => array(
                    'type' => 'string',
                    'default' => '#ffffff'                    
                ),
                'inactiveStarColor' => array(
                    'type' => 'string',
                    'default' => '#888888'
                ),
                'activeStarColor' => array(
                    'type' => 'string',
                    'default' => '#eeee00'
                ),
                'selectedStarColor' => array(
                    'type' => 'string',
                    'default' => '#ffff00'
                ),
                'titleAlign' => array(
                    'type' => 'string',
                    'default' => 'left'
                ),
                'authorAlign' => array(
                    'type' => 'string',
                    'default' => 'left'
                )

            ),
            'render_callback' => 'ub_render_review_block'));
    }
}

add_action('init', 'ub_register_review_block');