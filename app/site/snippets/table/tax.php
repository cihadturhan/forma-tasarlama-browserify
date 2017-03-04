<?php
    $total = 0;
    foreach($entries as $entry){
        $total += (floatval($entry->quantity) * floatval($entry->price));
    }
    echo $total;

?>