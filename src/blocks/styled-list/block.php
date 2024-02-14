<?php
require_once dirname(dirname(dirname(__DIR__))) . '/includes/ultimate-blocks-styles-css-generator.php';

function ub_render_styled_list_block($attributes, $contents){
    extract($attributes);

    $listItems = '';

    if(json_encode($listItem) === '[' . join(',', array_fill(0, 3,'{"text":"","selectedIcon":"check","indent":0}')) . ']'){
        $listItems = $list;
    }
    else{
        $sortedItems = [];

        foreach($listItem as $elem){
            $last = count($sortedItems) - 1;
            if (count($sortedItems) === 0 || $sortedItems[$last][0]['indent'] < $elem['indent']) {
                array_push($sortedItems, array($elem));
            }
            else if ($sortedItems[$last][0]['indent'] === $elem['indent']){
                array_push($sortedItems[$last], $elem);
            }
            else{
                while($sortedItems[$last][0]['indent'] > $elem['indent']){
                    array_push($sortedItems[count($sortedItems) - 2], array_pop($sortedItems));
                    $last = count($sortedItems) - 1;
                }
                if($sortedItems[$last][0]['indent'] === $elem['indent']){
                    array_push($sortedItems[$last], $elem);
                }
            }
        }
    
        while(count($sortedItems) > 1 &&
            $sortedItems[count($sortedItems) - 1][0]['indent'] > $sortedItems[count($sortedItems) - 2][0]['indent']){
            array_push($sortedItems[count($sortedItems) - 2], array_pop($sortedItems));
        }
    
        $sortedItems = $sortedItems[0];
    
        if (!function_exists('ub_makeList')) {
            function ub_makeList($num, $item, $color, $size){
                static $outputString = '';
                if($num === 0 && $outputString != ''){
                    $outputString = '';
                }
                if (isset($item['indent'])){                
                    $outputString .= '<li>'.($item['text'] === '' ? '<br/>' : $item['text']) . '</li>';
                }
                else{
                    $outputString = substr_replace($outputString, '<ul class="fa-ul">',
                        strrpos($outputString, '</li>'), strlen('</li>'));
    
                    forEach($item as $key => $subItem){
                        ub_makeList($key+1, $subItem, $color, $size);
                    }
                    $outputString .= '</ul>' . '</li>';
                }
                return $outputString;
            }
        }
    
        foreach($sortedItems as $key => $item){
            $listItems = ub_makeList($key, $item, $iconColor, $iconSize);
        }
    }
    $list_alignment_class = !empty($listAlignment) ? "ub-list-alignment-" . $listAlignment : "";
    if($list === ''){
        return '<ul class="' . ($isRootList ?
                            ('wp-block-ub-styled-list ub_styled_list ' . $list_alignment_class . (
                                    isset($className) ? ' ' . esc_attr($className)
                                    : '') .'"'
                         . ($blockID === '' ? '' : ' id="ub_styled_list-' . $blockID . '"'))
                         : 'ub_styled_list_sublist"').
        '><div class="ub-block-list__layout">' . $contents . '</div></ul>';

    }
    else{
        return '<div class="wp-block-ub-styled-list ub_styled_list ' . (isset($className) ? ' ' . esc_attr($className) : '') .'"'
        . ($blockID === '' ? '' : ' id="ub_styled_list-' . $blockID . '"').
        '><ul class="fa-ul">' . $listItems . '</ul></div>';
    }

}

function ub_register_styled_list_block() {
	if ( function_exists( 'register_block_type_from_metadata' ) ) {
        require dirname(dirname(__DIR__)) . '/defaults.php';
        register_block_type_from_metadata( dirname(dirname(dirname(__DIR__))) . '/dist/blocks/styled-list/block.json', array(
            'attributes' => $defaultValues['ub/styled-list']['attributes'],
            'render_callback' => 'ub_render_styled_list_block'));
	}
}

function ub_get_styled_list_item_styles( $attributes ) {
	$padding = Ultimate_Blocks\includes\get_spacing_css( isset($attributes['padding']) ? $attributes['padding'] : array() );
	$margin = Ultimate_Blocks\includes\get_spacing_css( isset($attributes['margin']) ? $attributes['margin'] : array() );

	$styles = array(
		'padding-top'         => isset($padding['top']) ? $padding['top'] : "",
		'padding-left'        => isset($padding['left']) ? $padding['left'] : "",
		'padding-right'       => isset($padding['right']) ? $padding['right'] : "",
		'padding-bottom'      => isset($padding['bottom']) ? $padding['bottom'] : "",
		'margin-top'         => !empty($margin['top']) ? $margin['top'] . " !important" : "",
		'margin-left'        => !empty($margin['left']) ? $margin['left'] . " !important" : "",
		'margin-right'       => !empty($margin['right']) ? $margin['right'] . " !important" : "",
		'margin-bottom'      => !empty($margin['bottom']) ? $margin['bottom'] . " !important" : "",
	);

	return Ultimate_Blocks\includes\generate_css_string( $styles );
}
function ub_render_styled_list_item_block($attributes, $contents, $block){
    extract($attributes);
    $block_attributes  = isset($block->parsed_block['attrs']) ? $block->parsed_block['attrs'] : array();

    $styles = ub_get_styled_list_item_styles($block_attributes);

    return '<li class="ub_styled_list_item" style="'. $styles .'">' . $itemText . $contents . '</li>';
}

function ub_register_styled_list_item_block(){
    if ( function_exists( 'register_block_type_from_metadata' ) ) {
        require dirname(dirname(__DIR__)) . '/defaults.php';
        register_block_type_from_metadata( dirname(dirname(dirname(__DIR__))) . '/dist/blocks/styled-list/style-list-item/block.json', array(
            'attributes' => $defaultValues['ub/styled-list-item']['attributes'],
            'render_callback' => 'ub_render_styled_list_item_block'));
	}
}

add_action('init', 'ub_register_styled_list_block');
add_action('init', 'ub_register_styled_list_item_block');