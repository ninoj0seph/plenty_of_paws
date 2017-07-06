<?php
require 'assets/requires/yelpRequest.php';

try{
    require 'assets/requires/authKeys.php';
} catch (Exception $e){
    trigger_error(sprintf(
        'Curl failed with error #%d: %s',
        $e->getCode(), $e->getMessage()),
        E_USER_ERROR);
}

$ch = curl_init();
$zipCode = "92801";
$maxShelterResults = "25";

// set URL and other appropriate options
curl_setopt($ch, CURLOPT_URL, "https://api.petfinder.com/shelter.find?key=$PETFINDER_API_KEY&location=$zipCode&format=xml&count=$maxShelterResults");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "GET");
curl_setopt($ch, CURLOPT_HEADER, 0);

$shelters = (simplexml_load_string(curl_exec($ch)))->shelters->shelter;
curl_close($ch);
print_r($shelters);

print_r(json_decode(yelpRequest::request()));
