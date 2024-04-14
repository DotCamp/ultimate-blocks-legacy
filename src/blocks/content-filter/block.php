<?php
require_once dirname(dirname(dirname(__DIR__))) . '/includes/ultimate-blocks-styles-css-generator.php';


function ub_get_content_filter_panel_styles( $attributes ) {
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
/**
 * Enqueue frontend script for table fo contents block
 *
 * @return void
 */

 function ub_render_content_filter_entry_block($attributes, $content, $block){
    extract($attributes);
    $block_attributes  = isset($block->parsed_block['attrs']) ? $block->parsed_block['attrs'] : array();
    $styles = ub_get_content_filter_panel_styles($block_attributes);

    return '<div class="ub-content-filter-panel'.(isset($className) ? ' ' . esc_attr($className) : '').
        ($initiallyShow ? '' : ' ub-hide').'" style="'. $styles .'" data-selectedFilters="'.json_encode($selectedFilters).
        '">'.$content.'</div>';
}

function ub_register_content_filter_entry_block(){
    if ( function_exists( 'register_block_type_from_metadata' ) ) {
        register_block_type_from_metadata( dirname(dirname(dirname(__DIR__))) . '/dist/blocks/content-filter/components/block.json', array(
            'attributes' => array(
                // UNCOMMENTED OUT, IN JS BLOCK GET UNDEFINED AND BREAKS.
                'availableFilters' => array(
                    'type' => 'array',
                    'default' => array()//get list of filters from parent block
                ),
                'selectedFilters' => array(
                    'type' => 'array',
                    'default' => array()
                ),
                'buttonColor' => array(
                    'type' => 'string',
                    'default' => '#aaaaaa'
                ),
                'buttonTextColor' => array(
                    'type' => 'string',
                    'default' => '#000000'
                ),
                'initiallyShow' => array(
                    'type' => 'boolean',
                    'default' => true
                ),
                'padding'   => array(
                    'type'    => 'array',
                    'default' => array()
                ),
                'margin'   => array(
                    'type'    => 'array',
                    'default' => array()
                ),
            ),
                'render_callback' => 'ub_render_content_filter_entry_block'));
        }
}

function ub_render_content_filter_block($attributes, $content){
    extract($attributes);

    if(!isset($filterArray)){
        $filterArray = array();
    }

    $newFilterArray = json_decode(json_encode($filterArray), true);

    $filterList = '';

    foreach((array)$newFilterArray as $key1 => $filterGroup){
        $filterList .= '<div class="ub-content-filter-category"
        data-canUseMultiple="' . json_encode($filterGroup['canUseMultiple']) . '">
        <div class="ub-content-filter-category-name">' . $filterGroup['category'] . '</div>';
        $filters = '<div class="ub-content-filter-buttons-wrapper">';
        foreach($filterGroup['filters'] as $key2 => $tag){
            $filters .= '<div data-tagIsSelected="false" data-categoryNumber="' . $key1 . '"
            data-filterNumber="' . $key2 . '" ' . ($blockID === '' ? 'data-normalColor="' . $buttonColor . '" data-normalTextColor="' . $buttonTextColor .
            '" data-activeColor="' . $activeButtonColor . '" data-activeTextColor="' . $activeButtonTextColor .
            '"style="background-color: ' . $buttonColor.'; color: ' . $buttonTextColor . '"' : '') . ' class="ub-content-filter-tag">' .
            $tag.'</div>';
        }
        $filterList .= $filters . '</div>';
        $filterList .= '</div>';
    }

$currentSelection = array_map(function($category){
                        return ($category['canUseMultiple'] ?
                                array_fill(0, count($category['filters']), false) :
                                -1);
                    }, (array)$filterArray);
     $classes = array();
    $block_attributes = get_block_wrapper_attributes(
            array(
                'class' => implode(" ", $classes)
            )
    );
return '<div ' . $block_attributes .
        '"'. ($blockID === '' ? : ' id="ub-content-filter-' . $blockID . '"') .
        ' data-currentSelection="'.json_encode($currentSelection).
        '" data-initiallyShowAll="'.json_encode($initiallyShowAll).
        '" data-matchingOption="'.$matchingOption.'">'. 
    $filterList . $content . '</div>';
}

function ub_register_content_filter_block(){
    if ( function_exists( 'register_block_type_from_metadata' ) ) {
        require dirname(dirname(__DIR__)) . '/defaults.php';
        register_block_type_from_metadata( dirname(dirname(dirname(__DIR__))) . '/dist/blocks/content-filter/block.json', array(
            'attributes' => $defaultValues['ub/content-filter-block']['attributes'],
                'render_callback' => 'ub_render_content_filter_block'));
        
    }

}

function ub_content_filter_add_frontend_assets() {
    require_once dirname(dirname(__DIR__)) . '/common.php';

    $presentBlocks = ub_getPresentBlocks();

    foreach( $presentBlocks as $block ){
        if($block['blockName'] === 'ub/content-filter' || $block['blockName'] === 'ub/content-filter-block'){
            wp_enqueue_script(
                'ultimate_blocks-content-filter-front-script',
                plugins_url( 'content-filter/front.build.js', dirname( __FILE__ ) ),
                array( ),
                Ultimate_Blocks_Constants::plugin_version(),
                true
            );
            break;
        }
    }
}

add_action( 'wp_enqueue_scripts', 'ub_content_filter_add_frontend_assets' );
add_action('init', 'ub_register_content_filter_entry_block');
add_action('init', 'ub_register_content_filter_block');