<?php

function ub_render_styled_list_block($attributes){
    extract($attributes);

    $sortedItems = [];

    foreach($listItem as $elem){
        $last = count($sortedItems) - 1;
        if (count($sortedItems) == 0 || $sortedItems[$last][0]['indent'] < $elem['indent']) {
            array_push($sortedItems, array($elem));
        }
        else if ($sortedItems[$last][0]['indent'] == $elem['indent']){
            array_push($sortedItems[$last], $elem);
        }
        else{
            while($sortedItems[$last][0]['indent'] > $elem['indent']){
                array_push($sortedItems[count($sortedItems) - 2], array_pop($sortedItems));
                $last = count($sortedItems) - 1;
            }
            if($sortedItems[$last][0]['indent'] == $elem['indent']){
                array_push($sortedItems[$last], $elem);
            }
        }
    }

    while(count($sortedItems) > 1 &&
        $sortedItems[count($sortedItems) - 1][0]['indent'] > $sortedItems[count($sortedItems) - 2][0]['indent']){
        array_push($sortedItems[count($sortedItems) - 2], array_pop($sortedItems));
    }

    $sortedItems = $sortedItems[0];

    $listItems = '';

    if (!function_exists('ub_makeList')) {
        function ub_makeList($num, $item, $color){
            require  dirname(dirname(__DIR__)) . '/common.php';
            static $outputString = '';
            if($num == 0 && $outputString != ''){
                $outputString = '';
            }
            if (array_key_exists("indent", $item)){                
                $outputString .= '<li><span class="fa-li"><svg xmlns="http://www.w3.org/2000/svg"
                    height="15", width="15" viewBox="0, 0, '.$fontAwesomeIcon[$item['selectedIcon']][0].', '.$fontAwesomeIcon[$item['selectedIcon']][1]
                    .'"><path fill="'.$color.'" d="'.$fontAwesomeIcon[$item['selectedIcon']][2].'"></svg></span>'.($item['text']==''?'<br/>':$item['text']).'</li>';
            }
            else{
                $outputString = substr_replace($outputString, '<ul class="fa-ul">',
                    strrpos($outputString, '</li>'), strlen('</li>'));

                forEach($item as $key => $subItem){
                    ub_makeList($key+1, $subItem, $color);
                }
                $outputString .= '</ul>' . '</li>';
            }
            return $outputString;
        }
    }

    foreach($sortedItems as $key => $item){
        $listItems = ub_makeList($key, $item, $iconColor);
    }

    return '<div class="ub_styled_list '.(isset($className) ? ' ' . esc_attr($className): '')
            .'"><ul class="fa-ul">'.$listItems.'</ul></div>';
}

function ub_register_styled_list_block() {
	if ( function_exists( 'register_block_type' ) ) {
        register_block_type( 'ub/styled-list', array(
            'attributes' => array(
                'listItem' => array(
                    'type' => 'array',
                    'default' => array(
                        array(
                            'text' => '',
                            'selectedIcon' => 'check',
                            'indent' => 0
                        )
                    )
                ),
                'iconColor' => array(
                    'type' => 'string',
                    'default' => '#000000'
                )
            ),
			'render_callback' => 'ub_render_styled_list_block'));
	}
}

add_action('init', 'ub_register_styled_list_block');