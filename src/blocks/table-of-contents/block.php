<?php

function ub_render_table_of_contents_block($attributes){
    extract($attributes);
    $linkArray = json_decode($links, true);

    $filteredHeaders = array_values(array_filter($linkArray, function ($header) use ($allowedHeaders){
        return $allowedHeaders[$header['level'] - 1];
    }));

    $sortedHeaders = [];

    foreach($filteredHeaders as $elem){
        $last = count($sortedHeaders) - 1;
        if (count($sortedHeaders) == 0 || $sortedHeaders[$last][0]['level'] < $elem['level']) {
            array_push($sortedHeaders, [$elem]);
        }
        else if ($sortedHeaders[$last][0]['level'] == $elem['level']){
            array_push($sortedHeaders[$last], $elem);
        }
        else{
            while($sortedHeaders[$last][0]['level'] > $elem['level']){
                array_push($sortedHeaders[count($sortedHeaders) - 2], array_pop($sortedHeaders));
                $last = count($sortedHeaders) - 1;
            }
            if($sortedHeaders[$last][0]['level'] == $elem['level']){
                array_push($sortedHeaders[$last], $elem);
            }
        }
    }

    while(count($sortedHeaders) > 1 &&
        $sortedHeaders[count($sortedHeaders) - 1][0] > $sortedHeaders[count($sortedHeaders) - 2][0]){
        array_push($sortedHeaders[count($sortedHeaders) - 2], array_pop($sortedHeaders));
    }

    $sortedHeaders = $sortedHeaders[0];

    $listItems = '';

    if (!function_exists('ub_makeListItem')) {
        function ub_makeListItem($num, $item, $listStyle){
            static $outputString = '';
            if($num == 0 && $outputString != ''){
                $outputString = '';
            }
            if (array_key_exists("level", $item)){
                $anchor = $item["anchor"];
                $content = $item["content"];
                $outputString .= '<li><a href="#'.$anchor.'">'.
                    preg_replace('/(<.+?>)/', '', $content) .'</a></li>';
            }
            else{
                $openingTag = $listStyle == 'numbered' ? '<ol>' : '<ul'.
                    ($listStyle == 'plain' ? ' style="list-style: none;"' : '').'>';

                $outputString = substr_replace($outputString, $openingTag,
                    strrpos($outputString, '</li>'), strlen('</li>'));

                forEach($item as $key => $subItem){
                    ub_makeListItem($key+1, $subItem, $listStyle);
                }
                $outputString .= ($listStyle == 'numbered' ? '</ol>' : '</ul>') . '</li>';
            }
            return $outputString;
        }
    }

    foreach($sortedHeaders as $key => $item){
        $listItems = ub_makeListItem($key, $item, $listStyle);
    }

    return '<div class="ub_table-of-contents '.esc_attr($className).'" data-showtext="'.__('show').'" data-hidetext="'.__('hide').'">'.
                (strlen($title) > 0 ? ('<div class="ub_table-of-contents-header">
                    <div class="ub_table-of-contents-title">'.
                        $title .'</div>'.
                    ($allowToCHiding ?
                    '<div id="ub_table-of-contents-header-toggle">
                        <div id="ub_table-of-contents-toggle">
                            [<a class="ub_table-of-contents-toggle-link" href="#">'.
                            __($showList ? 'hide' : 'show')
                            .'</a>]</div></div>' :'')
                .'</div>') : '')
                .'<div class="ub_table-of-contents-container ub_table-of-contents-' .
                    $numColumns. '-column" style="display: '.
                    ($showList || strlen($title) == 0 || (strlen($title) == 1 && $title[0] == '') 
                    ? 'block' : 'none').';">'.
                ($listStyle == 'numbered' ? '<ol>' : '<ul'.
                    ($listStyle == 'plain' ? ' style="list-style: none;"' : '').'>')
                . $listItems .
                ($listStyle == 'numbered' ? '</ol>' : '</ul>')
                .'</div></div>';
}

function ub_register_table_of_contents_block() {
	if( function_exists( 'register_block_type' ) ) {
		register_block_type( 'ub/table-of-contents-block', array(
            'attributes' => array(
                'blockID' => array(
                    'type' => 'string',
                    'default' => ''
                ),
                'title' => array(
                    'type' => 'string',
                    'default' => ''
                ),
                'allowedHeaders' => array(
                    'type' => 'array',
                    'default' => array_fill(0, 6, true)
                ),
                'links' => array(
                    'type' => 'string',
                    'default' => ''
                ),
                'allowToCHiding' => array(
                    'type' => 'boolean',
                    'default' => false
                ),
                'showList' => array(
                    'type' => 'boolean',
                    'default' => true
                ),
                'numColumns' => array(
                    'type' => 'number',
                    'default' => 1
                ),
                'listStyle' => array(
                    'type' => 'string',
                    'default' => 'bulleted'
                )
            ),
            'render_callback' => 'ub_render_table_of_contents_block'));
    }
}

function ub_table_of_contents_add_frontend_assets() {
    if ( has_block( 'ub/table-of-contents' ) or has_block( 'ub/table-of-contents-block' ) ) {
        wp_enqueue_script(
            'ultimate_blocks-table-of-contents-front-script',
            plugins_url( 'table-of-contents/front.build.js', dirname( __FILE__ ) ),
            array( ),
            Ultimate_Blocks_Constants::plugin_version(),
            true
        );
    }
}

add_action('init', 'ub_register_table_of_contents_block');
add_action( 'wp_enqueue_scripts', 'ub_table_of_contents_add_frontend_assets' );