<?php

function ub_generateStarDisplay($value, $limit, $id, $inactiveStarColor,
    $activeStarColor, $starOutlineColor, $className=''){
    $stars = '';

    foreach(range(0, $limit-1) as $current){
        $stars .= '<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 150 150">
        <defs><mask id="ub_review_star_filter-' . $id . '-' . $current
        .'"><rect height="150" width="' . ($value - $current > 0 ?
            ($value - $current < 1 ? $value - $current : 1) : 0) * 150
        .'" y="0" x="0" fill="#fff"/></mask></defs> <path fill="' . $inactiveStarColor . '" stroke-width="2.5"
        d="m0.75,56.89914l56.02207,0l17.31126,-56.14914l17.31126,56.14914l56.02206,0l-45.32273,34.70168l17.31215,56.14914l-45.32274,-34.70262l-45.32274,34.70262l17.31215,-56.14914l-45.32274,-34.70168z"
        stroke="' . $starOutlineColor . '"/><path class="star" id="star' . $current .
        '" mask="url(#ub_review_star_filter-' . $id. '-' . $current . ')" fill="' . $activeStarColor . '" strokeWidth="2.5"
        d="m0.75,56.89914l56.02207,0l17.31126,-56.14914l17.31126,56.14914l56.02206,0l-45.32273,34.70168l17.31215,56.14914l-45.32274,-34.70262l-45.32274,34.70262l17.31215,-56.14914l-45.32274,-34.70168z"
        stroke="' . $starOutlineColor . '"/>
        </svg>';
    }

    return '<div class="' . $className . '">' . $stars . '</div>';
}

function ub_render_review_block($attributes){
    extract($attributes);
    $parsedItems = isset($parts) ? $parts : json_decode($items, true);

    if($blockID == ''){
        $blockID = $ID;
    }

    $extractedValues = array_map(function($item){
                                    return $item['value'];
                                }, $parsedItems);

    $average = round(array_sum($extractedValues)/count($extractedValues), 1);

    $starRatings = '';

    foreach($parsedItems as $key=>$item){
        $starRatings .= '<div class="ub_review_entry">' . $item['label'].
        ub_generateStarDisplay($item['value'], $starCount, $blockID . '-' . $key,
        $inactiveStarColor, $activeStarColor, $starOutlineColor, "ub_review_stars") . '</div>';
    }

    $offerCode = '"offers":{
        "@type": "' . $offerType . '",
        "priceCurrency": "' . esc_html($offerCurrency) . '",' .
            ($offerType == 'AggregateOffer' ? 
                '"lowPrice": "' . $offerLowPrice . '",
                "highPrice": "' . $offerHighPrice . '",
                "offerCount": "' . $offerCount . '"' 
            : '"price": "' . $offerPrice . '",
                "url": "' . esc_url($callToActionURL) . '"' .
                ($offerExpiry > 0 ? (', "priceValidUntil": "' . date("Y-m-d", $offerExpiry) . '"') : '')).
    '}';

    $itemExtras = '';

    switch ($itemType){
        case 'Book':
            $itemExtras = '"author": "'. esc_html($bookAuthorName) . '",
                            "isbn": "'. esc_html($isbn) . '"';
        break;
        case 'Course':
            $itemExtras = '"provider": "' . esc_html($provider) . '"';
        break;
        case 'Event':
            $itemExtras = $offerCode . ',
            "startDate": "'. date("Y-m-d", $eventStartDate) . '",' .
            ($eventEndDate > 0 ? '"endDate": "'. date("Y-m-d", $eventEndDate) . '",' : '').
            '"location":{
                "@type":'. ($usePhysicalAddress ?
                            '"Place",
                "name": "' . esc_html($addressName) . '",
                "address": "' . esc_html($address) . '"' :
                            '"VirtualLocation",
                "url": "' . esc_url($eventPage) . '"').
            '},
            "organizer": "' . esc_html($organizer) . '",
            "performer": "' . esc_html($performer) . '"';
        break;
        case 'Product':
            $itemExtras = '"brand": {
                                "@type": "Brand",
                                "name": "' . esc_html($brand) . '"
                            },
                            "sku": "'. esc_html($sku) .'",
                            "' . esc_html($identifierType) . '": "' . esc_html($identifier) . '",' . $offerCode;
        break;
        case 'LocalBusiness':
            $itemExtras =  isset($cuisines) ? ( '"servesCuisine":' . json_encode($cuisines) . ',') : '' .
                            '"address": "' . esc_html($address) . '",
                            "telephone": "' . esc_html($telephone) . '",
                            "priceRange": "' . esc_html($priceRange) . '"';
        break;
        case 'Organization':
            $itemExtras = (in_array($itemSubsubtype, array('Dentist', 'Hospital', 'MedicalClinic', 'Pharmacy', 'Physician')) ? ('"priceRange":"' . esc_html($priceRange) . '",'): '').
            '"address": "' . esc_html($address) . '",
            "telephone": "' . $telephone . '"';
        break;
        case 'SoftwareApplication':
            $itemExtras = '"applicationCategory": "' . esc_html($appCategory) . '",
                            "operatingSystem": "' . esc_html($operatingSystem) . '",' . $offerCode;
        break;
        case 'MediaObject':
            $itemExtras = $itemSubtype == 'VideoObject' ? 
                    ('"uploadDate": "'.date("Y-m-d", $videoUploadDate) . '", 
                    "contentUrl": "' . esc_url($videoURL) . '"') : '';
        break;
        default:
            $itemExtras = '';
        break;
    }

    return '<div class="ub_review_block' . (isset($className) ? ' ' . esc_attr($className) : '') .
                '" id="ub_review_' . $blockID . '">
        <p class="ub_review_item_name"' . ($blockID == '' ? ' style="text-align: ' . $titleAlign . ';"' : '') . '>' .
            $itemName . '</p><p class="ub_review_author_name"' .
            ($blockID == '' ? ' style="text-align: ' . $authorAlign . ';"' : '') . '>' . $authorName . '</p>' .
        (($enableImage || $enableDescription) && ($imgURL != '' || $description != '') ?
        '<div class="ub_review_description_container">' .
            (!$enableDescription || $description == '' ? '' : '<div class="ub_review_description">' . $description . '</div>') .
            (!$enableImage || $imgURL == '' ? '' : '<img class="ub_review_image" src="' . $imgURL . '" alt = "' . $imgAlt . '">') .
        '</div>' : '').
            $starRatings
    .'<div class="ub_review_summary">' .
        ($useSummary ? '<p class="ub_review_summary_title">' . $summaryTitle . '</p>' : '') .
        '<div class="ub_review_overall_value">' .
            ($useSummary ? '<p>' . $summaryDescription . '</p>' : '') .
            '<div class="ub_review_average"><span class="ub_review_rating">' . $average . '</span>' .
            ub_generateStarDisplay($average, $starCount, $blockID . '-average',
            $inactiveStarColor, $activeStarColor, $starOutlineColor, "ub_review_average_stars").
            '</div>
        </div>
        <div class="ub_review_cta_panel">' .
        ($enableCTA && $callToActionURL != '' ? '<div class="ub_review_cta_main">
            <a href="' . esc_url($callToActionURL) .
                '" ' . ($ctaOpenInNewTab ? 'target="_blank" ' : '') . 'rel="' . ($ctaNoFollow ? 'nofollow ' : '') . ($ctaIsSponsored ? 'sponsored ': '') . 'noopener noreferrer"' .
                    ($blockID == '' ? '  style="color: ' . $callToActionForeColor . ';"' : '') . '>
                <button class="ub_review_cta_btn"' . ($blockID == '' ? ' style="background-color: ' . $callToActionBackColor
                . '; border-color: ' . $callToActionForeColor . '; color: ' . $callToActionForeColor . ';"' : '') . '>' .
                    ($callToActionText== '' ? 'Click here' : $callToActionText) . '</button></a></div>' : '') .
                '</div></div>' . ($enableReviewSchema ? preg_replace( '/\s+/', ' ', ('<script type="application/ld+json">{
        "@context": "http://schema.org/",
        "@type": "Review",' .
        ($useSummary ? '"reviewBody": "' . esc_html(preg_replace('/(<.+?>)/', '', $summaryDescription)) . '",' : '') .
        '"description": "' . esc_html(preg_replace('/(<.+?>)/', '', $description)) . '",
        "itemReviewed": {
            "@type":"' . ($itemSubsubtype ?: $itemSubtype ?: $itemType) . '",' .
            ($itemName ? ('"name":"' . esc_html(preg_replace('/(<.+?>)/', '', $itemName)) . '",') : '') .
            ($imgURL ? (($itemSubtype == 'VideoObject' ? '"thumbnailUrl' : '"image') . '": "' . esc_url($imgURL) . '",') : '') .
            '"description": "' . esc_html(preg_replace('/(<.+?>)/', '', $description)) .'"'
                . ($itemExtras == '' ? '' : ',' . $itemExtras ) .
        '},
        "reviewRating":{
            "@type": "Rating",
            "ratingValue": "' . ($average % 1 == 0 ? $average : number_format($average, 1, '.', '')) . '",
            "bestRating": "' . $starCount . '"
        },
        "author":{
            "@type": "Person",
            "name": "'. esc_html(preg_replace('/(<.+?>)/', '', $authorName)) .'"
        },
        "publisher": "'.$reviewPublisher.'",
        "datePublished": "'. date("Y-m-d", $publicationDate) . '",
        "url": "'.get_permalink().'"
    }</script>')) : '')
    . '</div>';
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