<?php

function generateISODurationCode($inputArr){
    $newInputArr = $inputArr;
    $tIsAbsent = true;
    $output = 'P';
    $unitLetters = ['Y', 'M', 'W', 'D', 'H', 'M', 'S'];

    if( $newInputArr[2] > 0 && 
        count(array_filter($newInputArr, function($item){return $item > 0;})) > 1 ){
            $newInputArr[3] += $newInputArr[2] * 7;
            $newInputArr[2] = 0;
    }

    foreach($newInputArr as $i => $t){
        if($i > 3 && $tIsAbsent){
            $output .= 'T';
            $tIsAbsent = false;
        }
        if($t > 0){
            $output .= round($t) . $unitLetters[$i]; //decimal values for time aren't recognized
        }
    }
    return $output;
}

function ub_render_how_to_block($attributes){
    extract($attributes);

    $header = '';

    $timeUnits = [__("seconds"), __("minutes"), __("hours"),
         __("days"), __("weeks"), __("months"), __("years")];

    $suppliesCode = '"supply": [';
    if($includeSuppliesList){
        $header .= '<h2>'.$suppliesIntro.'</h2>';
        if(count($supplies) > 0){
            $header .= '<ul>';
            foreach($supplies as $i => $s){
                $header .= '<li>' . $s['name'] . '</li>';
                if($i > 0){
                    $suppliesCode .= ',';
                }
                $suppliesCode .= '{"@type": "HowToSupply", "name": "'.$s['name'].'"}';
            }
            $header .= '</ul>';
        }
    }
    $suppliesCode .= ']';

    $toolsCode = '"tool": [';

    if($includeToolsList){
        $header .= '<h2>'.$toolsIntro.'</h2>';
        if(count($tools) > 0){
            $header .= '<ul>';
            foreach($tools as $i => $t){
                $header .= '<li>' . $t['name'] . '</li>';
                if($i > 0){
                    $toolsCode .= ',';
                }
                $toolsCode .= '{"@type": "HowToTool", "name": "'.$t['name'].'"}';
            }
            $header .= '</ul>';
        }
    }
    $toolsCode  .= ']'; 

    $costDisplay = $showUnitFirst ? $costCurrency . ' ' . $cost : $cost . ' ' . $costCurrency;

    $timeDisplay = '<div><h2>' . $timeIntro . '</h2>';

    $totalTimeDisplay = '';

    foreach($totalTime as $i => $t){
        if($t > 0){
            $totalTimeDisplay .= $t . ' ' . $timeUnits[6-$i] . ' ';
        }
    }

    $timeDisplay .= '<p>' . __('Total time') . ': '. $totalTimeDisplay  .'</div>';

    $ISOTotalTime = generateISODurationCode($totalTime);

    $stepsDisplay = '';
    $stepsCode = PHP_EOL .  '"step": [';

    if($useSections){
        $stepsDisplay = '<ol class="ub_howto_steps_display">';
        foreach($section as $i => $s){
            $stepsDisplay .= '<li class="ub_howto_section"><h3>' . $s['sectionName'] . '</h3>';
            $stepsCode .= '{"@type": "HowToSection",' . PHP_EOL
                        . '"name": "'. $s['sectionName'] . '",' . PHP_EOL
                        . '"itemListElement": [' . PHP_EOL;
            //get each step inside section
            foreach($s['steps'] as $j => $step){
                $stepsCode .= '{"@type": "HowToStep",'. PHP_EOL
                            . '"name": "'.$step['title'].'",' . PHP_EOL
                            . '"url": "'.get_permalink().'#'.$step['anchor'].'",' . PHP_EOL
                            . '"image": "' . $step['stepPic']['url'].'",'
                            . '"itemListElement" :[{'. PHP_EOL;

                $stepsDisplay .= '<div class="ub_howto_step"><h4 id="'.$step['anchor'].'">'
                    . $step['title'].'</h4>' .'<img src="' .$step['stepPic']['url']. '">'
                    .$step['direction'] . PHP_EOL;

                $stepsCode .= '"@type": "HowToDirection",' . PHP_EOL
                            . '"text": "' .($step['title'] == '' ? '' : $step['title'] . ' ') .$step['direction'].'"}' . PHP_EOL;

                if ($step['tip'] != ''){
                    $stepsDisplay .= $step['tip'];
                    $stepsCode .= ',{"@type": "HowToTip",' . PHP_EOL
                                . '"text": "'.$step['tip'].'"}' . PHP_EOL;
                }

                $stepsCode .= ']}'. PHP_EOL;
                $stepsDisplay .= '</div>';
                if($j < count($s['steps'])-1){
                    $stepsCode .= ',';
                }
            }
            $stepsDisplay .= '</li>'; //close section div
            $stepsCode .= ']}';
            if($i < count($section)-1){
                $stepsCode .= ',';
            }
        }
    }
    else{
        $stepsDisplay .= '<ol>';
        if(count($section) > 0){
            foreach($section[0]['steps'] as $j => $step){
                $stepsDisplay .= '<li class="ub_howto_step"><h4 id="'.$step['anchor'].'">'
                        . $step['title'].'</h4>'
                        . '<img src="' .$step['stepPic']['url']. '">'
                        . $step['direction'].$step['tip'].'</li>';
                $stepsCode .= '{"@type": "HowToStep",'. PHP_EOL
                            . '"name": "'.$step['title'].'",' . PHP_EOL
                            . '"url": "'.get_permalink().'#'.$step['anchor'].'",' . PHP_EOL
                            . '"image": "' . $step['stepPic']['url'].'",' . PHP_EOL     
                            . ($step['hasVideoClip'] ? '"video":{"@id": "'.$step['anchor'].'"}' : '') . PHP_EOL
                            . '"itemListElement" :[{'. PHP_EOL
                            . '"@type": "HowToDirection",' . PHP_EOL
                            . '"text": "' . ($step['title'] == '' ? '' : $step['title'] . ' ') . $step['direction'].'"}' . PHP_EOL;
    
                if ($step['tip'] != ''){
                    $stepsCode .= ',{"@type": "HowToTip",' . PHP_EOL
                                . '"text": "'.$step['tip'].'"}' . PHP_EOL;
                }
    
                $stepsCode .= ']}'. PHP_EOL;
                if($j < count($section[0]['steps'])-1){
                    $stepsCode .= ',';
                }
            }
        }
    }
    $stepsDisplay .= '</ol>';
    $stepsCode .= ']';

    $parts = array_map( function($sec){ return $sec['steps'];}, $section);
    $clips = '';

    if($videoURL != ''){
        if(strpos($videoURL,'https://www.youtube.com') === 0){
            $videoClipArg = '?t=';
        }
        if(strpos($videoURL, 'https://vimeo.com') === 0){
            $videoClipArg = '#t=';
        }
        if(strpos($videoURL, 'https://www.dailymotion.com') === 0){
            $videoClipArg = '?start=';
        }
        if(strpos($videoURL, 'https://videopress.com') === 0){
            $videoClipArg = '?at=';
        }
    }

    foreach($parts as $part){
        foreach($part as $step){
            if($step['hasVideoClip']){
                if($clips != ''){
                    $clips .= ',';
                }
                $clips .='{"@type": "Clip",
                            "@id": "' . $step['anchor'] . '",
                            "name": "' . $step['title'] . '",
                            "startOffset": "' . $step['videoClipStart'] . '",
                            "endOffset": "' . $step['videoClipEnd'] . '",
                            "url": "' . $videoURL . $videoClipArg . $step['videoClipStart'] . '" }';
            }
        }
    }

    $JSONLD = '<script type="application/ld+json">
    {
        "@context": "http://schema.org",
        "@type": "HowTo",
        "name":"'.$title.'",
        "description": "'.$introduction.'",'.
        '"totalTime": "'.$ISOTotalTime.'",'.($videoURL == '' ?:
        '"video": {
            "@type": "VideoObject",
            "name": "'.$videoName.'"
            "description": "'.$videoDescription.'",
            "thumbnailUrl": "'.$videoThumbnailURL.'",
            "contentUrl": "'.$videoURL.'",
            "uploadDate": "'. date('c', $videoUploadDate) .'",
            "hasPart":['.$clips.']
        },').'
        "estimatedCost": {
            "@type": "MonetaryAmount",
            "currency": "'.$costCurrency.'",
            "value": "'.$cost.'"
        },'.$suppliesCode.','
        .$toolsCode.','.$stepsCode
    .',"yield": "'.$howToYield.'",
    "image": "'.$finalImageURL.'"   }</script>';

    return '<div class="ub_howto" id="ub_howto_'.$blockID.'"><h2>'
                . $title . '</h2>' . $introduction
                . $header . ($videoURL == '' ?: $videoEmbedCode) 
                . '<p>Total cost: ' . $costDisplay . '</p>'
                . $timeDisplay . $stepsDisplay . '<h2>' . $resultIntro . '</h2>' . $howToYield 
                . ($finalImageURL == '' ? '' : '<img src="' .$finalImageURL. '">') .
            '</div>' . $JSONLD;
}

function ub_register_how_to_block(){
    if ( function_exists( 'register_block_type' ) ) {
        require dirname(dirname(__DIR__)) . '/defaults.php';
        register_block_type('ub/how-to', array(
            'attributes' => $defaultValues['ub/how-to']['attributes'],
            'render_callback' => 'ub_render_how_to_block'));
    }
}

add_action('init', 'ub_register_how_to_block');