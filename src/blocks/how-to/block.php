<?php

function ub_render_how_to_block($attributes){
    extract($attributes);

    $header = '';

    $timeUnits = array( "seconds", "minutes", "hours",
                    "days", "weeks", "months", "years");

    $toolsCode = '"tool": [';

    if($includeToolsList){
        $header .= '<h2>Tools needed</h2>';
        if(count($tools) > 0){
            $header .= '<ul>';
            foreach($tools as $i => $t){
                $header .= $t;
                if($i > 0){
                    $toolsCode .= ',';
                }
                $toolsCode .= '{"@type": "HowToTool",
                    "name": "'.$t.'"}';
            }
            $header .= '</ul>';
        }
    }
    $toolsCode  .= ']'; 

    $suppliesCode = '"supply": [';
    if($includeSuppliesList){
        $header .= '<h2>Supplies needed</h2>';
        if(count($supplies) > 0){
            $header .= '<ul>';
            foreach($supplies as $i => $s){
                $header .= $s;
                if($i > 0){
                    $suppliesCode .= ',';
                }
                $suppliesCode .= '{"@type": "HowToSupply",
                    "name": "'.$s.'"}';
            }
            $header .= '</ul>';
        }
    }
    $suppliesCode .= ']';

    $costDisplay = $showUnitFirst ? $costCurrency . ' ' . $cost : $cost . ' ' . $costCurrency;

    //check if detailedtime requires separate displays for preptime, performtime and total time

    $timeDisplay = '<div>';

    if($useDetailedTime){
        $timeDisplay .= '<p>Preparation time: '.$prepTime.' '.$prepTimeUnit.
                        '</p><p>Performance time: '.$performTime.' '.$performTimeUnit.'</p>';

        $ISOPrepTime = 'P';
        if(array_search($prepTimeUnit, $timeUnits) < 3){
            $ISOPrepTime .= 'T';
        }
        $ISOPrepTime .= $prepTime . strtoupper($prepTimeUnit[0]);
        
        $ISOPerformTime = 'P';
        if(array_search($performTimeUnit, $timeUnits) < 3){
            $ISOPerformTime .= 'T';
        }
        $ISOPerformTime .= $performTime . strtoupper($performTimeUnit[0]);
    }

    //override settings when a value of 1 or greater for next larger unit is present

    /*$unitMultiplier = [1, 60, 60, 24, 7, 365, 12];
    $currentTimeUnitIndex = array_search($totalTimeUnit, $timeUnits);
    if($currentTimeIndex < 6){
        $conversionFactor = $unitMultiplier[$currentTimeUnitIndex+1] / ($currentTimeUnitIndex == 4 ? 84 : 1);
        while($totalTime / $conversionFactor > 1){
    
        }
    }*/


    //$timeDisplay .= 'time unit  index: ' . json_encode($timeUnits);
    $timeDisplay .= '<p>Total time: '.$totalTime.' '.$totalTimeUnit.'</p></div>';
    $ISOTotalTime = 'P';
    if(array_search($totalTimeUnit, $timeUnits) < 3){
        $ISOTotalTime .= 'T';
    }
    $ISOTotalTime .= $totalTime . strtoupper($totalTimeUnit[0]);

    $stepsDisplay = '';
    $stepsCode = PHP_EOL .  '"step": [';

    if($useSections){
        $stepsDisplay = '<ol class="ub_howto_steps_display">';
        foreach($section as $i => $s){
            //$section
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
                    . $step['title'].'</h4>'
                    .'<img src="' .$step['stepPic']['url']. '">'
                    .$step['direction'] . PHP_EOL;

                //$stepsCode .= '"name" : "'.$step['title'].'",' . PHP_EOL;
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
                            . '"image": "' . $step['stepPic']['url'].'",'
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

    $JSONLD = '<script type="application/ld+json">
    {
        "@context": "http://schema.org",
        "@type": "HowTo",
        "name":"'.$title.'",
        "description": "'.$introduction.'",
        "totalTime": "'.$ISOTotalTime.'",
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
                . $header . '<p>Total cost: ' . $costDisplay . '</p>'
                . $timeDisplay . $stepsDisplay . $howToYield 
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