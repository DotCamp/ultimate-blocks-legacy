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

function ub_convert_to_paragraphs($string){
    if($string === ''){
        return '';
    }
    else{
        $string = explode('<br>', $string);
        $string = array_map(function($p){return '<p>'.$p.'</p>';}, $string);
        return implode('', $string);
    }
}

function ub_strip_html_tags($string){
    return preg_replace('/<\/?[a-zA-Z0-9]+( .+(=\".+?\")?)*\/?>/', '', $string);
}

function ub_render_how_to_block($attributes){
    extract($attributes);

    $header = '';

    $timeUnits = ["second", "minute", "hour", "day", "week", "month", "year"];

    $suppliesCode = '"supply": [';
    if($advancedMode && $includeSuppliesList){
        $header .= '<h2>'.$suppliesIntro.'</h2>';
        if(count($supplies) > 0){
            $header .=  $suppliesListStyle === 'ordered' ? '<ol' : '<ul';
            $header .= ' class="ub_howto-supplies-list">';
            foreach($supplies as $i => $s){
                $header .= '<li>' . $s['name'] . ($s['imageURL'] === '' ? '' :
                            '<br><img src="'.$s['imageURL'].'"/>') . '</li>';
                if($i > 0){
                    $suppliesCode .= ',';
                }
                $suppliesCode .= '{"@type": "HowToSupply", "name": "'.ub_strip_html_tags($s['name']).'"'.
                            ($s['imageURL'] === ''? '' : ',"image": "'.$s['imageURL'].'"').'}';
            }
            $header .= $suppliesListStyle === 'ordered' ? '</ol>' : '</ul>';
        }
    }
    $suppliesCode .= ']';

    $toolsCode = '"tool": [';

    if($advancedMode && $includeToolsList){
        $header .= '<h2>'.$toolsIntro.'</h2>';
        if(count($tools) > 0){
            $header .= $toolsListStyle === 'ordered' ? '<ol' : '<ul';
            $header .= ' class="ub_howto-tools-list">';
            foreach($tools as $i => $t){
                $header .= '<li>' . $t['name'] . ($t['imageURL'] === '' ? '' :
                            '<br><img src="'.$t['imageURL'].'"/>') . '</li>';
                if($i > 0){
                    $toolsCode .= ',';
                }
                $toolsCode .= '{"@type": "HowToTool", "name": "'.ub_strip_html_tags($t['name']).'"'
                                .($t['imageURL'] === ''? '' : ',"image": "'.$t['imageURL'].'"').'}';
            }
            $header .= $toolsListStyle === 'ordered' ? '</ol>' : '</ul>';
        }
    }
    $toolsCode  .= ']'; 

    $costDisplay = $showUnitFirst ? $costCurrency . ' ' . $cost : $cost . ' ' . $costCurrency;

    $timeDisplay = '<div><h2>' . $timeIntro . '</h2>';

    $totalTimeDisplay = '';

    foreach($totalTime as $i => $t){
        if($t > 0){
            $totalTimeDisplay .= $t . ' ' . __($timeUnits[6-$i] . ($t > 1 ? 's' : '')) . ' ';
        }
    }

    $timeDisplay .= '<p>' . $totalTimeText . $totalTimeDisplay  .'</div>';

    $ISOTotalTime = generateISODurationCode($totalTime);

    $stepsDisplay = '';
    $stepsCode = PHP_EOL .  '"step": [';

    if($useSections){
        $stepsDisplay =  ($sectionListStyle === 'ordered' ? '<ol' : '<ul') .
                            ' class="ub_howto-section-display">';
        foreach($section as $i => $s){
            $stepsDisplay .= '<li class="ub_howto-section"><h3>' . $s['sectionName'] . '</h3>' . 
            ($sectionListStyle === 'ordered' ? '<ol' : '<ul') . ' class="ub_howto-step-display">';
            $stepsCode .= '{"@type": "HowToSection",' . PHP_EOL
                        . '"name": "'. ub_strip_html_tags($s['sectionName']) . '",' . PHP_EOL
                        . '"itemListElement": [' . PHP_EOL;
            //get each step inside section
            
            foreach($s['steps'] as $j => $step){
                $stepsCode .= '{"@type": "HowToStep",'. PHP_EOL
                            . '"name": "'.ub_strip_html_tags($step['title']).'",' . PHP_EOL
                            . ($advancedMode ? '"url": "'.get_permalink().'#'.$step['anchor'].'",' . PHP_EOL
                            . ($step['hasVideoClip'] ? '"video":{"@id": "'.$step['anchor'].'"}' : '') . PHP_EOL : '')
                            . '"image": "' . $step['stepPic']['url'].'",' . PHP_EOL
                            . '"itemListElement" :[{'. PHP_EOL;

                $stepsDisplay .= '<li class="ub_howto-step"><h4 id="'.$step['anchor'].'">' 
                    . $step['title'].'</h4>' . ($step['stepPic']['url'] !== '' ? 
                    ($step['stepPic']['caption'] === '' ? '' : '<figure>') .
                        '<img class="ub_howto-step-image" src="' .$step['stepPic']['url']. '">' 
                    . ($step['stepPic']['caption'] === '' ? '' : '<figcaption>'.$step['stepPic']['caption'].'</figcaption></figure>')
                        : '')
                    . ub_convert_to_paragraphs($step['direction']) . PHP_EOL;

                $stepsCode .= '"@type": "HowToDirection",' . PHP_EOL
                            . '"text": "' .($step['title'] === '' || !$advancedMode ? '' : ub_strip_html_tags($step['title']) . ' ')
                            . ub_strip_html_tags($step['direction']) .'"}' . PHP_EOL;

                if ($step['tip'] !== ''){
                    $stepsDisplay .= ub_convert_to_paragraphs($step['tip']);
                    $stepsCode .= ',{"@type": "HowToTip",' . PHP_EOL
                                . '"text": "' . ub_strip_html_tags($step['tip']) . '"}' . PHP_EOL;
                }

                $stepsCode .= ']}'. PHP_EOL;
                $stepsDisplay .= '</li>';
                if($j < count($s['steps'])-1){
                    $stepsCode .= ',';
                }
            }

            $stepsDisplay .=  ($sectionListStyle === 'ordered' ? '</ol>' : '</ul>')
                        . '</li>'; //close section div
            $stepsCode .= ']}';
            if($i < count($section)-1){
                $stepsCode .= ',';
            }
        }
    }
    else{
        $stepsDisplay .=  ($sectionListStyle === 'ordered' ? '<ol' : '<ul') .
                            ' class="ub_howto-step-display">';
        if(count($section) > 0){
            foreach($section[0]['steps'] as $j => $step){
                $stepsDisplay .= '<li class="ub_howto-step"><h4 id="'.$step['anchor'].'">'
                        . $step['title'].'</h4>' . ($step['stepPic']['url'] !== '' ? 
                            ($step['stepPic']['caption'] === '' ? '' : '<figure>') . 
                                '<img class="ub_howto-step-image" src="' .$step['stepPic']['url'] . '">' . 
                            ($step['stepPic']['caption'] === '' ? '' : '<figcaption>'.$step['stepPic']['caption'].'</figcaption></figure>') : '') .
                        ub_convert_to_paragraphs($step['direction']);

                $stepsCode .= '{"@type": "HowToStep",'. PHP_EOL
                            . '"name": "'. ub_strip_html_tags($step['title']) .'",' . PHP_EOL
                            . ($advancedMode ? '"url": "'.get_permalink().'#'.$step['anchor'].'",' . PHP_EOL
                            . ($step['hasVideoClip'] ? '"video":{"@id": "'.$step['anchor'].'"}' : '') . PHP_EOL : '')
                            . '"image": "' . $step['stepPic']['url'].'",' . PHP_EOL     
                            . '"itemListElement" :[{'. PHP_EOL
                            . '"@type": "HowToDirection",' . PHP_EOL
                            . '"text": "' . ($step['title'] === '' || !$advancedMode ? '' : ub_strip_html_tags($step['title']) . ' ')
                                        . ub_strip_html_tags($step['direction']).'"}' . PHP_EOL;
    
                if ($step['tip'] !== ''){
                    $stepsDisplay .= ub_convert_to_paragraphs($step['tip']);
                    $stepsCode .= ',{"@type": "HowToTip",' . PHP_EOL
                                . '"text": "' . ub_strip_html_tags($step['tip']) . '"}' . PHP_EOL;
                }
    
                $stepsDisplay .= '</li>';
                $stepsCode .= ']}'. PHP_EOL;
                if($j < count($section[0]['steps'])-1){
                    $stepsCode .= ',';
                }
            }
        }
    }
    $stepsDisplay .=  $sectionListStyle === 'ordered' ? '</ol>' : '</ul>';
    $stepsCode .= ']';

    $parts = array_map( function($sec){ return $sec['steps'];}, $section);
    $clips = '';

    if($videoURL !== ''){
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
                if($clips !== ''){
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
        "name":"'. ub_strip_html_tags($title) .'",
        "description": "'.ub_strip_html_tags($introduction).'",'.
        ($advancedMode ?
            (array_unique($totalTime) !== array(0)? '"totalTime": "'.$ISOTotalTime.'",' : '').
            ($videoURL === '' ? '':
            '"video": {
                "@type": "VideoObject",
                "name": "'.$videoName.'",
                "description": "'.$videoDescription.'",
                "thumbnailUrl": "'.$videoThumbnailURL.'",
                "contentUrl": "'.$videoURL.'",
                "uploadDate": "'. date('c', $videoUploadDate) .'",
                "hasPart":['.$clips.']
            },').
            ($cost > 0 ? '"estimatedCost": {
                "@type": "MonetaryAmount",
                "currency": "'. ub_strip_html_tags($costCurrency) .'",
                "value": "'. ub_strip_html_tags($cost) .'"
            },' : '')
            .$suppliesCode.','
            .$toolsCode.','
        :'')
    .$stepsCode.',"yield": "'.ub_strip_html_tags($howToYield).'",
    "image": "'.$finalImageURL.'"'   .'}</script>';

    return '<div class="ub_howto" id="ub_howto_'.$blockID.'"><h2>'
                . $title . '</h2>' . ub_convert_to_paragraphs($introduction) . $header . 
                ($advancedMode ? ($videoURL === '' ? '' : $videoEmbedCode) 
                . '<p>' . $costDisplayText . $costDisplay . '</p>'
                . $timeDisplay : '') . $stepsDisplay .   
                '<div class="ub_howto-yield"><h2>' . $resultIntro . '</h2>' . 
                ($finalImageURL === '' ? '' : ($finalImageCaption === '' ? '' : '<figure class="ub_howto-yield-image-container">') .
                    '<img class="ub_howto-yield-image" src="' .$finalImageURL. '">' . 
                    ($finalImageCaption === '' ? '' : '<figcaption>'. $finalImageCaption .'</figcaption></figure>')) .
                ub_convert_to_paragraphs($howToYield) . '</div>
            </div>' . $JSONLD;
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