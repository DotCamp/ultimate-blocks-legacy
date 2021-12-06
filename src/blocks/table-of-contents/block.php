<?php

function ub_render_table_of_contents_block($attributes){
    extract($attributes);
    $linkArray = json_decode($links, true);

    $filteredHeaders = array_values(array_filter($linkArray, function ($header) use ($allowedHeaders){
        return $allowedHeaders[$header['level'] - 1] && 
           (!array_key_exists("disabled",  $header) || (array_key_exists("disabled",  $header) && !$header['disabled']));
    }));

    if(!isset($gaps) || is_null($gaps)){
        $gaps = [];
    }

    $currentGaps = array_values(array_filter($gaps, function($gap, $index) use($allowedHeaders, $linkArray){
        return $allowedHeaders[$linkArray[$index]['level'] - 1] && (!array_key_exists("disabled",  $linkArray[$index]) || (array_key_exists("disabled", $linkArray[$index]) && !$linkArray[$index]['disabled']));
    }, ARRAY_FILTER_USE_BOTH));

    $sortedHeaders = [];

    foreach($filteredHeaders as $elem){
        $elem['content'] = trim(preg_replace('/(<.+?>)/', '', $elem['content']));
        $last = count($sortedHeaders) - 1;
        if (count($sortedHeaders) === 0 || $sortedHeaders[$last][0]['level'] < $elem['level']) {
            array_push($sortedHeaders, [$elem]);
        }
        else if ($sortedHeaders[$last][0]['level'] === $elem['level']){
            array_push($sortedHeaders[$last], $elem);
        }
        else{
            while($sortedHeaders[$last][0]['level'] > $elem['level'] && count($sortedHeaders) > 1){
                array_push($sortedHeaders[count($sortedHeaders) - 2], array_pop($sortedHeaders));
                $last = count($sortedHeaders) - 1;
            }
            if($sortedHeaders[$last][0]['level'] === $elem['level']){
                array_push($sortedHeaders[$last], $elem);
            }
        }
    }

    if(count($sortedHeaders) > 0){
        while(count($sortedHeaders) > 1 &&
            $sortedHeaders[count($sortedHeaders) - 1][0]['level'] > $sortedHeaders[count($sortedHeaders) - 2][0]['level']){
            array_push($sortedHeaders[count($sortedHeaders) - 2], array_pop($sortedHeaders));
        }
        $sortedHeaders = $sortedHeaders[0];
    }

    $listItems = '';

    if (!function_exists('ub_makeListItem')) {
        function ub_makeListItem($num, $item, $listStyle, $blockID, $currentGaps){
            static $outputString = '';
            if($num === 0 && $outputString !== ''){
                $outputString = '';
            }
            if (isset($item['level'])){
                //intercept otter  headings here
                if(strpos($item["anchor"], "themeisle-otter ") === 0){
                    $anchor = '#' . str_replace("themeisle-otter ", "", $item["anchor"]);
                }
                else{
                    $anchor = '#' . $item["anchor"];
                }

                if(count($currentGaps) > $num && get_query_var('page') !== $currentGaps[$num]){
                    $baseURL = get_permalink();
                    $anchor = $baseURL . ($currentGaps[$num] > 1 ? (get_post_status(get_the_ID()) === 'publish' ? '' : '&page=')
                            . $currentGaps[$num] : '') . $anchor;
                }

                $content = array_key_exists("customContent", $item) && !empty($item["customContent"]) ? $item["customContent"] : $item["content"];
                $outputString .= '<li><a href='. $anchor.'>'. $content .'</a></li>';
            }
            else{
                $openingTag = $listStyle === 'numbered' ? '<ol>' :
                    '<ul'.($listStyle === 'plain' && $blockID === '' ? ' style="list-style: none;"' : '').'>';

                $outputString = substr_replace($outputString, $openingTag,
                    strrpos($outputString, '</li>'), strlen('</li>'));

                forEach($item as $key => $subItem){
                    ub_makeListItem($key + 1, $subItem, $listStyle, $blockID, $currentGaps);
                }
                $outputString .= ($listStyle === 'numbered' ? '</ol>' : '</ul>') . '</li>';
            }
            return $outputString;
        }
    }

    if(count($sortedHeaders) > 0){
        foreach($sortedHeaders as $key => $item){
            $listItems = ub_makeListItem($key, $item, $listStyle, $blockID, $currentGaps);
        }
    }

    $targetType = '';
    if ($scrollTargetType === 'id'){
        $targetType = '#';
    }
    else if ($scrollTargetType === 'class'){
        $targetType = '.';
    }
    
    return '<div class="ub_table-of-contents' . (isset($className) ? ' ' . esc_attr($className) : '')
                . (!$showList && strlen($title) > 0 ? ' ub_table-of-contents-collapsed' : '' ) .
                '" data-showtext="' . __('show', 'ultimate-blocks') . '" data-hidetext="' . __('hide', 'ultimate-blocks')
                . '" data-scrolltype="' . $scrollOption . '"' . ($scrollOption === 'fixedamount' ? ' data-scrollamount="' . $scrollOffset . '"' : '')
                . ($scrollOption === 'namedelement' ? ' data-scrolltarget="' . $targetType . $scrollTarget . '"' : '')
                . ($blockID === '' ? '' : ' id="ub_table-of-contents-' . $blockID . '"') . ' data-initiallyhideonmobile="' . json_encode($hideOnMobile) . '"
                    data-initiallyshow="' . json_encode($showList) . '">'.
                (strlen($title) > 0 ? ('<div class="ub_table-of-contents-header-container"><div class="ub_table-of-contents-header">
                    <div class="ub_table-of-contents-title">'. $title . '</div>' . 
                    ($allowToCHiding ?
                    '<div class="ub_table-of-contents-header-toggle">
                        <div class="ub_table-of-contents-toggle">
                        &nbsp;[<a class="ub_table-of-contents-toggle-link" href="#">'.
                            __($showList ? 'hide' : 'show', 'ultimate-blocks')
                            .'</a>]</div></div>' : '')
                . '</div></div>') : '')
                . '<div class="ub_table-of-contents-extra-container"><div class="ub_table-of-contents-container ub_table-of-contents-' .
                    $numColumns . '-column ' . ($showList || strlen($title) === 0 ||
                    (strlen($title) === 1 && $title[0] === '') ? '' : 'ub-hide') . '">' .
                ($listStyle === 'numbered' ? '<ol>' :  '<ul'. ($listStyle === 'plain' && $blockID === '' ? ' style="list-style: none;"' : '') . '>')
                . $listItems .
                ($listStyle === 'numbered' ? '</ol>' : '</ul>')
                .'</div></div></div>';
}

function ub_register_table_of_contents_block() {
	if( function_exists( 'register_block_type' ) ) {
        require dirname(dirname(__DIR__)) . '/defaults.php';
		register_block_type( 'ub/table-of-contents-block', array(
            'attributes' => $defaultValues['ub/table-of-contents-block']['attributes'],
            'render_callback' => 'ub_render_table_of_contents_block'));
    }
}

function ub_table_of_contents_add_frontend_assets() {
    require_once dirname(dirname(__DIR__)) . '/common.php';

    $presentBlocks = ub_getPresentBlocks();

    foreach( $presentBlocks as $block ){
        if($block['blockName'] === 'ub/table-of-contents' || $block['blockName'] === 'ub/table-of-contents-block'){
            wp_enqueue_script(
                'ultimate_blocks-table-of-contents-front-script',
                plugins_url( 'table-of-contents/front.build.js', dirname( __FILE__ ) ),
                array( ),
                Ultimate_Blocks_Constants::plugin_version(),
                true
            );
            if(!wp_script_is('ultimate_blocks-scrollby-polyfill', 'queue')){
                wp_enqueue_script(
                    'ultimate_blocks-scrollby-polyfill',
                    plugins_url( 'scrollby-polyfill.js', dirname( __FILE__ ) ),
                    array(),
                    Ultimate_Blocks_Constants::plugin_version(),
                    true
                );
            }
        }
    }
}

add_action('init', 'ub_register_table_of_contents_block');
add_action( 'wp_enqueue_scripts', 'ub_table_of_contents_add_frontend_assets' );