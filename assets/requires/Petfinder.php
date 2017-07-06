<?php
class Petfinder{
    private $key, $zipCode, $maxShelterResults = "25";
    function __construct(){
        try{
            require 'assets/requires/authKeys.php';
        } catch (Exception $e){
            trigger_error(sprintf(
                'File containing API key not found! #%d: %s',
                $e->getCode(), $e->getMessage()),
                E_USER_ERROR);
        }
        $this->key = $PETFINDER_API_KEY;
        $this->zipCode = "92801"; //hardcoded to be changed

    }

    private function getShelters(){
        try{
            $curl = curl_init();
            curl_setopt_array($curl, array(
                    CURLOPT_URL => "https://api.petfinder.com/shelter.find?key={$this->key}&location=$zipCode&format=xml&count=$maxShelterResults",
                    CURLOPT_RETURNTRANSFER => true,
                    CURLOPT_ENCODING => "",
                    CURLOPT_MAXREDIRS => 10,
                    CURLOPT_TIMEOUT => 30,
                    CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
                    CURLOPT_CUSTOMREQUEST => "GET",
                )
            );
            $response = curl_exec($curl);
            if (FALSE === $response)
                throw new Exception(curl_error($curl), curl_errno($curl));
            $http_status = curl_getinfo($curl, CURLINFO_HTTP_CODE);
            if (200 != $http_status)
                throw new Exception($response, $http_status);
            curl_close($curl);
        } catch(Exception $e) {
            trigger_error(sprintf(
                'Curl failed with error #%d: %s',
                $e->getCode(), $e->getMessage()),
                E_USER_ERROR);
        }
        return json_decode(json_encode(simplexml_load_string($response)))->shelters->shelter;
    }

    public function getPets(){

    }

}